import { Timeline } from "./timeline";

describe("Timeline", ()=>{
  const ch={
    eins:{
      name: "eins",
      time: "2022-01-23"
    },
    zwei:{
      time: "+10D"
    },
    drei:{
      time: "+3w"
    },
    vier: {
      time: "18.3.2022"
    },
    fuenf: {
      time: "+3M"
    }
  }
  it ("analyzes a timeline",()=>{
    const t=new Timeline()
    const arr=t.analyze(ch)
    expect(arr).toBeInstanceOf(Array)
    expect(arr).toHaveLength(5)
  })
})