var myDateMh = new Date();
var _yearsMh = myDateMh.getFullYear();
var _monthMh = myDateMh.getMonth() + 1;


//当前年分
var currentYear = _yearsMh + '年';
var currentMonth={name:''};
var currentMonthArry = [];
for(var i=0; i < Number(_monthMh) ; i++){
   currentMonth.name = i+1+'月';
   currentMonthArry.push({name:currentMonth["name"]});
};
var currentY = [];
currentY.push({name:currentYear,child:currentMonthArry});
// console.log(currentY);


//当前年份之前的10年
var child = [
      {
      "name": "1月"
      },
      {
         "name": "2月"
      },
      {
         "name": "3月"
      },
      {
         "name": "4月"
      },
      {
         "name": "5月"
      },
      {
         "name": "6月"
      },
      {
         "name": "7月"
      },
      {
         "name": "8月"
      },
      {
         "name": "9月"
      },
      {
         "name": "10月"
      },
      {
         "name": "11月"
      },
      {
         "name": "12月"
      }
   ];
var beforeYears = {name:''};
var beforeYearsArry = [];
for(var j=0; j < 10 ; j++){
   beforeYears.name = _yearsMh - j - 1 + '年';
   beforeYearsArry.push({name:beforeYears["name"],child:child});
};
// console.log(beforeYearsArry);


var  yearsData = currentY.concat(beforeYearsArry);
// console.log(yearsData);

