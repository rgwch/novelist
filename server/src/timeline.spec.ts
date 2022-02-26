import { Timeline } from "./timeline";

describe("Timeline", ()=>{
  const ch={
    eins:{
      name: "eins",
      time: "2022-01-23"
    },
    zwei:{
      time: "+10d"
    },
    drei: {
      time: "9.3.2022"
    },
    vier: {
      time: "+3w"
    }
  }
  it ("analyzes a timeline",()=>{
    const t=new Timeline()
    const arr=t.analyze(ch)
    expect(arr).toBeInstanceOf(Array)
    expect(arr).toHaveLength(4)
  })
})