import { formatDate } from "@angular/common";

export class helper{
    // static getDatePeriodDates(filterVal) {
    //     const date =  new Date(); //date.setDate(date.getDate() + 2);    
    //     let filterFromDate: string;
    //     let filterToDate: string;
    //     switch(filterVal){
    //         case "T": 
    //             filterFromDate = formatDate(date, 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(date, 'dd-MM-yyyy', 'en'); 
    //         break;
    //         case "Y": 
    //             date.setDate(date.getDate() - 1)
    //             filterFromDate = formatDate(date, 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(date, 'dd-MM-yyyy', 'en');
    //         break;
    //         case "TW":
    //             var first = date.getDate() - date.getDay(); 
    //             filterFromDate = formatDate(new Date(date.setDate(first)).toUTCString(), 'dd-MM-yyyy', 'en');
    //             filterToDate = formatDate(new Date(date.setDate(first + 6)).toUTCString(), 'dd-MM-yyyy', 'en');   
    //             // console.log(filterVal,filterFromDate, filterToDate)     
    //             break;
    //         case "TM" :
    //             filterFromDate = formatDate(new Date(date.getFullYear(), date.getMonth(), 1), 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(date, 'dd-MM-yyyy', 'en');        
    //             // console.log(filterVal,filterFromDate, filterToDate)     
    //             break;
    //         case "LM":
    //             var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
    //             var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    //             filterFromDate = formatDate(firstDay, 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(lastDay, 'dd-MM-yyyy', 'en');   
    //             // console.log(filterVal,filterFromDate, filterToDate)     
    //             break;
    //         case "TY" :
    //             filterFromDate = formatDate(new Date(date.getFullYear(), 0, 1), 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(date, 'dd-MM-yyyy', 'en');   
    //             // console.log(filterVal,filterFromDate, filterToDate)     
    //             break;
    //         case "LT" :
    //             filterFromDate = formatDate(new Date(2022, 0, 1), 'dd-MM-yyyy', 'en');  
    //             filterToDate = formatDate(date, 'dd-MM-yyyy', 'en');        
    //             // console.log(filterVal,filterFromDate, filterToDate)     
    //             break;
    //     }
    //     return { filterFromDate, filterToDate };
    // }

    static getDatePeriodDatesForMongo(filterVal) {
        const date =  new Date(); //date.setDate(date.getDate() + 2);    
        let filterFromDate: string;
        let filterToDate: string;
        switch(filterVal){
            case "T": 
                filterFromDate = formatDate(date, 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(date, 'yyyy-MM-dd', 'en'); 
            break;
            case "Y": 
                date.setDate(date.getDate() - 1)
                filterFromDate = formatDate(date, 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(date, 'yyyy-MM-dd', 'en');
            break;
            case "TW":
                var first = date.getDate() - date.getDay(); 
                filterFromDate = formatDate(new Date(date.setDate(first)).toUTCString(), 'yyyy-MM-dd', 'en');
                filterToDate = formatDate(new Date(date.setDate(first + 6)).toUTCString(), 'yyyy-MM-dd', 'en');   
                // console.log(filterVal,filterFromDate, filterToDate)     
                break;
            case "TM" :
                filterFromDate = formatDate(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(date, 'yyyy-MM-dd', 'en');        
                // console.log(filterVal,filterFromDate, filterToDate)     
                break;
            case "LM":
                var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
                filterFromDate = formatDate(firstDay, 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(lastDay, 'yyyy-MM-dd', 'en');   
                // console.log(filterVal,filterFromDate, filterToDate)     
                break;
            case "TY" :
                filterFromDate = formatDate(new Date(date.getFullYear(), 0, 1), 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(date, 'yyyy-MM-dd', 'en');   
                // console.log(filterVal,filterFromDate, filterToDate)     
                break;
            case "LT" :
                filterFromDate = formatDate(new Date(2022, 0, 1), 'yyyy-MM-dd', 'en');  
                filterToDate = formatDate(date, 'yyyy-MM-dd', 'en');        
                // console.log(filterVal,filterFromDate, filterToDate)     
                break;
        }
        const fDate = (filterFromDate + " 00:00:00");
        const tDate =  (filterToDate+ " 23:59:00")
        return { fDate, tDate };
    }

    // Here reverse the date format & then convert to TIMESTAMP    
    static reverseAndTimeStamp(dateString) {
        //console.log(dateString)
        const reverse = new Date(dateString.split("-").reverse().join("-"));
        //console.log(reverse.getTime())
        return reverse.getTime();
    }

    static getMinDate(){
        return new Date(2020, 0, 1);
    }
    
    static getMaxDate(){
        var maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 1);
        return maxDate;
    }
    
    static getListName(listId:string){
        const year = listId.split('-')[0];
        const month = listId.split('-')[1];
        let monthName ="";
        switch(month){
          case "01":
            monthName = "January";
          break;
          case "02":
            monthName = "February";
          break;
          case "03":
            monthName = "March";
          break;
          case "04":
            monthName = "April";
          break;
          case "05":
            monthName = "May";
          break;
          case "06":
            monthName = "June";
          break;
          case "07":
            monthName = "July";
          break;
          case "08":
            monthName = "August";
          break;
          case "091":
            monthName = "September";
          break;
          case "10":
            monthName = "October";
          break;
          case "11":
            monthName = "November";
          break;
          case "12":
            monthName = "December";
          break;
        }
        return `${monthName} ${year}`;
    }
}