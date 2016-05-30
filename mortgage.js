const fs = require('fs');
const request = require('request');
const builder = require('botbuilder');

const ahaBot = new builder.TextBot();


/*
1. 先自我介紹，並告訴他可以問什麼內容
2. 告訴使用者目前完成哪些任務，並且引導
3. 互動成功，減少提示
4. 根據使用者與機器人的互動歷程，提供進一步的資訊
5. 確保機器人提供的是與任務相關資訊
6. 地圖 多選選單 地圖收尋

1. 你好我是aha機器人，你跟我說你要問房價或房貸相關問題，我會幫你計算，隨時可以說終止
2. 房貸
3. 請告訴我地址
4. 新北市新莊區後港一路65巷11弄四號三樓
5. 找出經緯度
6. 好的，你輸入的是 新北市新莊區後港一路65巷11弄四號三樓, 所以你家有幾坪?
7. 40
8. 好的 40坪, 你家屋齡?
9. 21
10. 好的 21年屋齡，那總樓層？
11. 10
12. 好的 總共10樓，這個建物類型是?
13. 公寓/ 大厦 有電梯
14. 公寓
15. 所以你輸入的事 新北市新莊區後港一路65巷１１弄四號三樓 40坪 總樓成10曾，對嗎
16. Y
17. 好的計算中...
18. 答案是 ____ 萬元，加上模型修正 ___萬元
*/





ahaBot.add('/', new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^房貸', builder.DialogAction.beginDialog('/mortgage'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault([function (session) {
        console.log("TEST1");
        if (!session.userData.name) {
          session.beginDialog('/profile');
        } 
    },function(session){
      console.log("TEST2");
      session.send('Hello %s! 你好我是aha機器人，你跟我說你要問房價或房貸相關問題，我會幫你計算，隨時可以說終止', session.userData.name);
      if(session.userData.mortgage){
        console.log(session.userData.mortgage);
        session.send('房貸地址 %s',session.userData.mortgage.address);  
      }else{
        consoel.log('沒有房貸資訊');
      }            
    },function(session,results){
      session.send("我來呈現");
      session.send(results.response);
    }]));
    
//進入房貸模式
ahaBot.add('/mortgage',new builder.CommandDialog()
  .onBegin(function (session, args, next) {
    if (!session.userData.firstRun) {
      // Send the user through the first run experience
      session.send('進入房貸');
      session.userData.mortgage = {};
    } else {
      next();
    }
  })
  .onDefault([
  function(session){      
    if(!session.userData.mortgage.address){
      session.beginDialog('/mortgage/address');
    }
  },function(session,result){
    if(!session.userData.pin){
      session.beginDialog('/mortgage/pin');
    }
  },function(session,result){
    if(!session.userData.houseyear){
      session.beginDialog('/mortgage/houseyear');
    }
  },function(session,result){
    if(!session.userData.totalfloor){
      session.beginDialog('/mortgage/totalfloor');
    }
  },function(session,result){
    if(!session.userData.totalfloor){
      session.beginDialog('/mortgage/type');
    }
  },function(session){
    console.log(session.userData.mortgage);
    session.endDialog({"response":session.userData.mortgage});
  }])
);

//進入房貸地址
ahaBot.add('/mortgage/address',[
  (session) =>{
    builder.Prompts.text(session, "請問你的地址");
  },
  (session, results) => {
    session.userData.mortgage.address = results.response;
    session.endDialog();
  }
]);

ahaBot.add('/mortgage/pin',[
  (session) =>{
    builder.Prompts.number(session, "好的，你輸入的是"+session.userData.mortgage.address+", 所以你家有幾坪?");
  },
  (session, results) => {
    session.userData.mortgage.pin = results.response;
    session.endDialog();
  }
]);

ahaBot.add('/mortgage/houseyear',[
  (session) =>{
    builder.Prompts.number(session, "請問你的屋齡");
  },
  (session, results) => {
    session.userData.mortgage.houseyear = results.response;
    session.endDialog();
  }
]);

ahaBot.add('/mortgage/totalfloor',[
  (session) =>{
    builder.Prompts.number(session, "請問你的總樓層");
  },
  (session, results) => {
    session.userData.mortgage.totalfloor = results.response;
    session.endDialog();
  }
]);

ahaBot.add('/mortgage/type',[
  (session) =>{
    builder.Prompts.text(session, "請問你的大樓是公寓還是大廈");
  },
  (session, results) => {
    if (results.response =="公寓"){
      if(session.userData.mortgage.address.indexOf("台北市")>=0){
        session.userData.mortgage.type = "AP";    
      }else if(session.userData.mortgage.address.indexOf("新北市")>=0){
        session.userData.mortgage.type = "NTP_AP";
      }
    }else if (results.response =="大廈"){
      if(session.userData.mortgage.address.indexOf("台北市")>=0){
        session.userData.mortgage.type = "BU";    
      }else if(session.userData.mortgage.address.indexOf("新北市")>=0){
        session.userData.mortgage.type = "NTP_BU";
      }
    }
    session.endDialog();
  }
]);

//進入身份模式
ahaBot.add('/profile', [
    (session) => {
        builder.Prompts.text(session, 'Hi! 你叫什麼名字');
    },
    (session, results) => {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

ahaBot.listenStdin();



/*
function setAddress(){
  var data = {
    emp_no:"13240",
    area_size:$scope.area_size, // unit: 坪
    house_age:$scope.my_build_age.m, // house age e.g., 21
    name:$scope.my_build_area.name, // distri  e.g., 新莊區
    floor:$scope.my_build_floor_cnt, //樓層
    total_floor:$scope.my_build_total_floor_cnt, //總樓層
    type:$scope.my_build_type.type //建物類型
  }
}



module.exports = {
  "sessions":sessions,
  
};
*/