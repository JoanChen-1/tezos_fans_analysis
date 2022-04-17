const akaswapGetAccountBaseUrl = 'https://akaswap.com/api/v2/accounts/';

// given an address, return its collections
const getCollectionByAddress = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/collections?limit=30`;
    const res = await fetch(endpoint, { method: "GET" });

    if (res.ok) {
        const jsonRes = await res.json();
        const tokenList = jsonRes.tokens.map(item => item.tokenId.toString());
        return tokenList;
    }
    else{
        return "fail";
    }
}


// given an address, return its creations
const getCreationsByAddress = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations?limit=30`;
    const res = await fetch(endpoint, { method: "GET"});

    if (res.ok) {
        const jsonRes = await res.json();
        const tokens = jsonRes.tokens.map(item => item.tokenId.toString());
        return tokens;
    }
    else{
        return "fail";
    }
}

const filterCollectorsByToken = (jsonRes, token) => {
    let collectors = [];
    jsonRes.tokens.some( t => {
        if (t.tokenId.toString() === token) {
            collectors = Object.keys(t.owners);
            console.log(t);
            return true;
        }
        else { return false; }
    })
    return collectors;
}

// get all owner list by creator's address and token
const getCollectorsByAddressNToken = async(address, token) => {
    token = token[0];
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations?limit=30`;
    const res = await fetch(endpoint, { method: "GET" });

    if (res.ok) {
        const jsonRes = await res.json();
        const collectors = filterCollectorsByToken(jsonRes, token);
        return collectors;
    }
    else{
        return "fail";
    }
}

const getCollectionsByMultipleAddress = async(addresses) => {
    const result = addresses.map(async address => {
        try{
            const collections = await getCollectionByAddress(address);
            return {address: address, collections: collections};
        }
        catch{
            return {address: address, collections: ["fail"]};
        }
    });
    return Promise.all(result);
}

const calculateMatchNum = (aList, bList) => {
    const intersection = aList.filter(item => bList.includes(item));
    return intersection.length;
}

const assignMatchNumProperty = (collectionsByCollectors, creations) => {
    collectionsByCollectors.forEach(collector => {
        const numOfMatch = calculateMatchNum(collector.collections, creations);
        collector.numOfMatch = numOfMatch;
    })
    return collectionsByCollectors;
}

// main function #1
export const getDatabyCollection = async(address, token, num) => {
    try{
        const collectorsByToken = await getCollectorsByAddressNToken(address, token);

        let collectionsByCollectors = await getCollectionsByMultipleAddress(collectorsByToken);

        const creations = await getCreationsByAddress(address);
        
        collectionsByCollectors = assignMatchNumProperty(collectionsByCollectors, creations);
        console.log(collectionsByCollectors);

        const fans = collectionsByCollectors.filter(collector => collector.numOfMatch >= num);
        if (fans.length <= 0){
            return -1;
        }
        return fans;
    }
    catch{
        return "fail";
    }
}




// get all owner list by creator's address
const getCollectorsList = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations?limit=30`;
    const res = await fetch(endpoint, {
        method: "GET",
    });

    if (res.ok) {
        const jsonRes = await res.json();
        const result = jsonRes.tokens.map(token=>Object.keys(token.owners)).flat();
        return result;
    }
    else{
        return "fail";
    }
}




// main function #2, return an array of objects
export const getDatabyCreator = async(method, creatorList) => {
    //method: union or intersection
    //1. get 2 dimentional owner lists
    //owner: who have one of the creators's creations
    creatorList = creatorList.filter(item => item !== "");
    let hasOwner = false;
    let ownerLists = creatorList.map (async(creatorAddress) => {
        let subOwnerList = await getCollectorsList(creatorAddress);
        if ( subOwnerList.length > 0){ hasOwner = true; }
        return subOwnerList;
    })
    ownerLists = await Promise.all(ownerLists);
    if (ownerLists.includes("fail")) {
        return "fail";
    }
    else if (!hasOwner){ // no any owner
        return -1;
    }
    let ownerList = [];
    
    // 2-1 get union
    if (method === "union"){
        // initialization
        ownerList = new Set();
        // get union
        ownerLists.forEach(async(list) => {
            list.forEach(owner => {
                ownerList.add(owner);
            })
        })
        ownerList = Array.from(ownerList)
    }

    // 2-2 get intersection
    else if (method === "intersection"){
        // initialization
        ownerList = ownerLists[0];
        if (ownerLists.length > 1 && ownerList.length > 0){
            // pop out the first array
            ownerLists.shift();
            // get intersection
            ownerLists.forEach((list) => {
                ownerList = list.filter(item => ownerList.includes(item));
            })
        }
    }

    if (ownerList.length <= 0){
        return -1;
    }
    //3. get collection by owners' addresses
    let fansInfos = ownerList.map(async(address) => {
        const collections = await getCollectionByAddress(address);
        return {address: address, collections: collections};
    })
    fansInfos = await Promise.all(fansInfos);

    fansInfos.forEach(item => {
        if (item.collections === "fail"){
            return "fail";
        }
    })
    return fansInfos;
}