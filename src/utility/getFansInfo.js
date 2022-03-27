const tzktGetAccountBaseUrl = 'https://api.tzkt.io/v1/accounts?';
const akaswapGetAccountBaseUrl = 'https://akaswap.com/api/v2/accounts/';

// given a range of balance, return a list of addresses 
export const getAddressByBalance = async(minBalance, maxBalance) => {
    const endpoint 
    = `${tzktGetAccountBaseUrl}balance.gt=${minBalance}
    &balance.lt=${maxBalance}&sort.desc=balance`;

    const res = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
        }
    });

    if (res.ok) {
        const jsonRes = await res.json();
        const addressList = jsonRes.map(item => item.address);
        return addressList;
    }
    else{
        return "fail";
    }
}

// given an address, return its collections
export const getCollectionByAddress = async(address) => {
    const endpoint = `${akaswapGetAccountBaseUrl}${address}/collections`;

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

// given a list of tokenId, return whether there is any tokenId in the collections
export const hasCollection = (tokenList, collectionList) => {
    const has = collectionList.some(item => tokenList.includes(item));
    return has;
}

// main function, return an array of objects
export const getFansInfo = async(minBalance, maxBalance, collectionList) => {
    //1. get address by balance
    const addressList = await getAddressByBalance(minBalance, maxBalance);
    //2. get collection by address
    let fansInfos = addressList.map(async(address) => {
        const tokenList = await getCollectionByAddress(address);
        if(hasCollection(tokenList, collectionList)){
            return {address: address, tokenList: tokenList};
        }
        else{
            return {address: address, tokenList: []};
        }
    })
    fansInfos = await Promise.all(fansInfos);
    fansInfos = fansInfos.filter(item => item.tokenList.length > 0);
    return fansInfos;
}