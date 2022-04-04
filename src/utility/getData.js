const tzktGetAccountBaseUrl = 'https://api.tzkt.io/v1/accounts?';
const akaswapGetAccountBaseUrl = 'https://akaswap.com/api/v2/accounts/';

// given a range of balance, return a list of addresses 
export const getAddressByBalance = async(minBalance, maxBalance) => {
    const endpoint 
    = `${tzktGetAccountBaseUrl}balance.gt=${minBalance}
    &balance.lt=${maxBalance}&sort.desc=balance&limit=1000&select=address,balance&type=user`;
    try{
        const res = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
            }
        });

        if (res.ok) {
            const jsonRes = await res.json();
            const addressList = jsonRes.map(item => item.address);//filter(item => item.activeTokensCount > 0)
            return addressList;
        }
        else{
            return "fail";
        }
    }
    catch{
        return "fail";
    }
}

// given an address, return its collections
export const getCollectionByAddress = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/collections`;
    try{
        const res = await fetch(endpoint, {
            method: "GET",
            header: {
                "Access-Control-Allow-Origin": "no-cors",
            }
        });

        if (res.ok) {
            const jsonRes = await res.json();
            const tokenList = jsonRes.tokens.map(item => item.tokenId.toString());
            return tokenList;
        }
        else{
            return "fail";
        }
    }
    catch{
        return "fail";
    }
}

// given a list of tokenId, return whether there is any tokenId in the collections
export const hasCollection = (collectionList, tokenList) => {
    const has = tokenList.some(item => collectionList.includes(item));
    return has;
}

// main function #1, return an array of objects
export const getDatabyCollection = async(minBalance, maxBalance, tokenList) => {

    //1. get address list by balance
    if ( minBalance > maxBalance ) { return "fail"; }
    let addressList = await getAddressByBalance(minBalance, maxBalance);
    if (addressList === "fail"){
        return "fail";
    }
    //2. get collection by address
    let fansInfos = addressList.map(async(address) => {
        const collectionList = await getCollectionByAddress(address);
        if (collectionList === "fail"){
            return "fail";
        }
        
        // union: has one of the token in the token list
        else if (hasCollection(collectionList, tokenList)){
            return {address: address, collectionList: collectionList};
        }
        else{// kick out the address having nothing in the token list
            return {address: address, collectionList: []};
        }
    })
    fansInfos = await Promise.all(fansInfos);
    
    // kick out the address having nothing in the token list
    fansInfos = fansInfos.filter(item => item.collectionList.length > 0);
    fansInfos.forEach(item => {
        if (item.collectionList === "fail"){
            return "fail";
        }
    })
    if (fansInfos.length <= 0){
        return -1;
    }
    return fansInfos;
}




// get owner list by creator's address
export const getOwnerList = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations`;
    try{
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
    catch{
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
        let subOwnerList = await getOwnerList(creatorAddress);
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
        const collectionList = await getCollectionByAddress(address);
        return {address: address, collectionList: collectionList};
    })
    fansInfos = await Promise.all(fansInfos);

    fansInfos.forEach(item => {
        if (item.collectionList === "fail"){
            return "fail";
        }
    })
    return fansInfos;
}