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
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "no-cors",
        }
    });

    if (res.ok) {
        const jsonRes = await res.json();
        const tokenList = jsonRes.token.map(item => item.tokenId);
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
    const fansInfos = [];
    addressList.forEach(async(address) => {
        const tokenList = await getCollectionByAddress(address);
        // console.log(tokenList);
        if(hasCollection(tokenList, collectionList)){
            fansInfos.push({address: address, tokenList: tokenList});
        };
    })
    if (fansInfos.length > 0){
        return fansInfos;
    }
    return null;
}