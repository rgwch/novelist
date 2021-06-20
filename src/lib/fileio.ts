export async function load(): Promise<any> {
  const result=await fetch("/files.json")
  if(result.ok){
    return await result.json()
  }else{
    return {status: result.status}
  }
}
