

export const fetchPares = async(par) =>{

    const url = 'https://criptoya.com/api/satoshitango/';

    const resp = await fetch( url + par ,{
        header:{
            "Content-Type": "application/json",
        },
    })

    const { bid } = await resp.json()

    return bid

}