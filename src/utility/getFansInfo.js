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

// given an address, return creator;s creations
export const getCreationsList = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations`;
    try{
        const res = await fetch(endpoint, {
            method: "GET",
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
export const hasCollection = (tokenList, collectionList) => {
    const has = collectionList.some(item => tokenList.includes(item));
    return has;
}

// // main function, return an array of objects
// export const getFansInfo = async(minBalance, maxBalance, collectionList, CreatorList) => {
//     //0. get creation list
//     let creationsList = await getCreationsList(creatorAddress);
//     if (creationsList === "fail") {
//         return "fail";
//     }
//     else if (creationsList.length <= 0){
//         return -1;
//     }
//     //1. get address by balance
//     let addressList = await getAddressByBalance(minBalance, maxBalance);
//     if (addressList === "fail"){
//         return "fail";
//     }
//     //2. get collection by address
//     let fansInfos = addressList.map(async(address) => {
//         const tokenList = await getCollectionByAddress(address);
//         if (tokenList === "fail"){
//             return "fail";
//         }
//         else if (hasCollection(tokenList, creationsList)){
//             return {address: address, tokenList: tokenList};
//         }
//         else{
//             return {address: address, tokenList: []};
//         }
//     })
//     fansInfos = await Promise.all(fansInfos);
//     if (fansInfos.includes("fail")){
//         return "fail";
//     }
//     fansInfos = fansInfos.filter(item => item.tokenList.length > 0);
//     return fansInfos;
// }

export const getOwnerList = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/creations`;
    try{
        const res = await fetch(endpoint, {
            method: "GET",
        });

        if (res.ok) {
            const jsonRes = await res.json();
            const result = jsonRes.tokens.map((token)=>{Object.keys(token.owners)}).flat();
            console.log(result);
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
// main function, return an array of objects
export const getFansInfo = async(CreatorList) => {
    //1. get creation list
    let OwnerList = new Set();
    CreatorList.forEach(async(creatorAddress) => {
        let subOwnerList = await getOwnerList(creatorAddress);
        subOwnerList.forEach(owner => {
            OwnerList.add(owner);
        })
    })
    if (OwnerList.includes("fail")) {
        return "fail";
    }
    else if (OwnerList.length <= 0){
        return -1;
    }

    //2. get collection by address
    let fansInfos = OwnerList.map(async(address) => {
        const collectionList = await getCollectionByAddress(address);
        if (collectionList === "fail"){
            return "fail";
        }
        else{
            return {address: address, collectionList: collectionList};
        }
    })

    fansInfos = await Promise.all(fansInfos);
    if (fansInfos.includes("fail")){
        return "fail";
    }
    return fansInfos;
}