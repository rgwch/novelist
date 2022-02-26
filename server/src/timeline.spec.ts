import { Timeline } from "./timeline";
import {Novel} from './novel'

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
  it ("analyzes a timeline",async ()=>{
    const novel=await Novel.fromDirectory("test", 'default',true)
    const t=new Timeline(novel)
    const arr=t.read()
    expect(arr).toBeInstanceOf(Array)
    expect(arr).toHaveLength(5)
    novel.close
  })
})