import axios from 'axios'
import {JSDOM} from 'jsdom'
import House from '../model/House.js'
import House_detail from '../model/House_detail.js'
import parseTable from './parseTable'
import DB from '../model/db'

DB.once('open',()=>{
    console.log('mongoDB connected')
})

export default async (fromWeb=false)=>{
    let i = 1
    let maxPage = 10
    for(;i<=maxPage;i++){
        let url = `https://evertrust.yungching.com.tw/regionall/%e6%96%b0%e5%8c%97%e5%b8%82/%e6%b0%b8%e5%92%8c%e5%8d%80/${i}?t=1,2&d=3`
        const ans = await axios.get(url)
        if(ans.status !== 200) return 0
        // console.log(ans.data)
        const {window:{document}} = new JSDOM(ans.data)
        if(i===1){
            const ul = document.getElementsByClassName('pagination')[0]
            // console.log(document.getElementsByClassName('pigination').innerHtml())
            const lis = ul.getElementsByTagName('li')
            if(lis.length===1){maxPage=1}
            else{
                const max = lis[lis.length-2].textContent
                console.log('max',max)
                maxPage = max
            }
        }
        const table = document.querySelectorAll('.table-wrapper tbody tr')
        const data = []
        console.log('table length',table.length)
        for(let i = 0;i<table.length;i+=2){
            const tds = table[i]
            if(tds.querySelectorAll('.notice div')[0]!==undefined) continue
            // console.log(tds.getElementsByClassName('noteBlock')[0])
            const {overview,detail} = await parseTable(tds)
            // data.push(overview)
            // data_detail.push(detail)
            data.push({overview,detail})
        }
        console.log('selected data:',data.length)
        // const house_details = await House_detail.insertMany(data_detail)
        // house_details.forEach(({_id},index)=>{
        //     data[index].detail = _id
        // })
        // await House.insertMany(data)
        data.forEach(async({overview,detail})=>{
            try{
                const house = await new House(overview).save()
                    // .catch(e=>{throw new Error()})
                const {_id} = await House_detail(detail).save()
                console.log('accept',_id)
                house.detail = _id
                house.save()
            }catch(e){
                console.log('skip',overview.id)
            }
        })
    }
}