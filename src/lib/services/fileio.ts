
export async function save(type:string,title:string,data:string):Promise<any>{
    
    const res=await fetch(`/novel/${type}-${title}.json`,{
        method: "POST",
        body: JSON.stringify(data)
    })
    if(res.ok){
        const ret=await res.json()
        return ret
    }
}

export function load(type:string):string{
    return ""
}