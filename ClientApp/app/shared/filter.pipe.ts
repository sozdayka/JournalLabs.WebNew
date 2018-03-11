import { Pipe, PipeTransform } from '@angular/core';
import { Journal } from '../models/Journal';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: any[],start?: any): any[] {
    // console.log("pipe work"); 
    // console.log(items);
    // console.log(searchText);
    
     if(!items) return [];
     if(!searchText) return items;



     let ids = items.map(item => item.Id);
     return searchText.filter(item => ids.indexOf(item.id) === -1);

     //searchText = searchText.toLowerCase();
    //  return items.filter( it => {
    //    var ret =  searchText.forEach(el=>{
    //      console.log("if("+el.Id+"== "+it.Id+")");
    //      if(el.Id== it.Id){
    //       console.log(el);
           
    //      }
    //      return el;
         
    //    });
    //    console.log(ret);
    //    return ret;
    //   //return it.name.toLowerCase().includes(searchText);
    //   //return it;
    //  });

    // // searchText = searchText.toLowerCase();
    // searchText = items.filter( it => {
    //       var ret = searchText.forEach(item =>{
    //       if(it.Id = item.Id)
    //       return item;
    //     });
    //     return ret;
    //       //return it.name.toLowerCase().includes(searchText);
    //     });
   } 
    // transform(value: number, args?: any): number {
    //     console.log(value);
    //     if(value<=0) return 0;
        
    //     let result = 1;
    //     for(let i=1; i<=value; i++){
    //         result = result * i;
    //     }
    //     return result;
    // }
}