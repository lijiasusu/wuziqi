 $(function(){
    var canvas=$("#canvas").get(0);
    var ctx=canvas.getContext('2d');
    var canvas1=$(".canvas1").get(0);
    var ctx1=canvas1.getContext('2d');
    var canvas2=$(".canvas2").get(0);
    var ctx2=canvas2.getContext('2d');
    var sep=40;
    var sr=4;
    var br=18;
    var qizi={};
    var audio=$("audio").get(0);
    var t,t1;
    var ai=false;
    var gemeState="pause";
    var kongbai={};
    function l(a){
      return (a+0.5)*sep+0.5;
    }
    // $("#ad").get(0).play();
    //画小圆点5个
    function cirle(x,y,r){
      ctx.save();
      ctx.fillStyle="#ab6e3d";
      ctx.beginPath();
      ctx.translate(l(x),l(y));
      ctx.arc(0,0,r,0,Math.PI*2);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
    cirle(3,3,sr);
    cirle(3,11,sr);
    cirle(7,7,sr);
    cirle(11,3,sr);
    cirle(11,11,sr);
    //记录每一个位置
    for(var i=0;i<15;i++){
      for(var j=0;j<15;j++){
        kongbai[M(i,j)]=true;
      }
    }
    //画棋盘
    function drawQipan(){
        ctx.clearRect(0,0,600,600);
        ctx.save();
        ctx.strokeStyle="#a97e54";
        ctx.beginPath();
        for(var i=0;i<15;i++){
          ctx.moveTo(l(i),l(0));
          ctx.lineTo(l(i),l(14));
          ctx.moveTo(l(0),l(i));
          ctx.lineTo(l(14),l(i));
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    drawQipan();
    //画棋子
    function luozi(x,y,color){
        gemeState="play";
        ctx.save();
        ctx.beginPath();
        ctx.translate(l(x),l(y));
        ctx.arc(0,0,br,0,Math.PI*2);
       if(color=="black"){
           var g=ctx.createRadialGradient(-6,-8,0,0,0,20);
            g.addColorStop(0,"#f4f4f4");
            g.addColorStop(0.1,"#eee");
            g.addColorStop(0.8,"#0a0a0a");
             ctx.fillStyle=g;
       }
        else if(color=="white"){
            var g=ctx.createRadialGradient(-15,-15,0,0,0,50);
            g.addColorStop(0,"#fff");
            g.addColorStop(0.3,"#bbb");
            g.addColorStop(1,"#000");
            ctx.fillStyle=g;
          }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        qizi[x+'_'+y]=color;
        delete kongbai[M(x,y)];
      }
      //点击落子
      function win(e){
        var x=Math.floor(e.offsetX/sep);
        var y=Math.floor(e.offsetY/sep);
        if(qizi[x+'_'+y]){
          return;
        }
        if(ai){
            luozi(x,y,"black");
            if(panduan(x,y,"black")>=5){
               console.log("黑棋赢") ;
               $(canvas).off("click");
               $(".heiwin").attr("id","win");
               $("#ad").get(0).pause(); 
            }
           right=0;
           t=setInterval(render,1000);
           clearInterval(t1);
           you(); 
           var p=intel();
           luozi(p.x,p.y,"white");
            if(panduan(p.x,p.y,"white")>=5){
               console.log("白棋赢") ;
               $(canvas).off("click");
               $(".baiwin").attr("id","win");
               $("#ad").get(0).pause(); 
            }
            left=0;
            t1=setInterval(render1,1000);
            clearInterval(t);
            zuo();
            return false;
        }
      if(flag){
        luozi(x,y,"black");
        if(panduan(x,y,"black")>=5){
         console.log("黑棋赢") ;
         $(canvas).off("click");
         $(".heiwin").attr("id","win");
         $("#ad").get(0).pause(); 

        }
        right=0;
        t=setInterval(render,1000);
        clearInterval(t1);
        you();   
      }else{
          luozi(x,y,"white");
          if(panduan(x,y,"white")>=5){
          console.log("白棋赢") ;
          $(canvas).off("click");
          $(".heiwin").attr("id","win");
          $("#ad").get(0).pause(); 

        }
          left=0;
          t1=setInterval(render1,1000);
          clearInterval(t);
          zuo();
      }
      flag=!flag;
      if ($(".col2").attr("id")) {
        $("#ac").get(0).play();
      }else{
        $("#ac").get(0).pause();
      }

      }
      var flag=true;
      $(canvas).on("click",win);
//重玩
 function chongwan(){
  $(".yin").removeAttr("id");
  $(canvas).on("click",win);
   flag=false;
   qizi={};
  drawQipan();
  $("#ad").get(0).play(); 

 }
 function intel(){
  var max=-Infinity;
  var pos={};
  for(var i in kongbai){
    var x=parseInt(i.split('_')[0]);
    var y=parseInt(i.split('_')[1]);
    var m=panduan(x,y,"black");
    if(m>max){
      max=m;
      pos={x:x,y:y};
    }
  }
  var max1=-Infinity;
  var pos1={};
  for(var i in kongbai){
    var x=parseInt(i.split('_')[0]);
    var y=parseInt(i.split('_')[1]);
    var m=panduan(x,y,"white");
    if(m>max1){
      max1=m;
      pos1={x:x,y:y};
    }
  }
  if(max>max1){
    return pos;
  }else{
    return pos1;
  }
 }
 $(".chongwan").on("click",chongwan);
 $(".tuichu").on("click",function(){
  chongwan();
  ai=false;
 })
 $(".buxiang").on("click",function(){
  chongwan();
  ai=false;
  $(".start").show();
 })
 //生成棋谱
 $('.manual').on("click",function(){
     qipu();
     $(".box").show();
 })
 $(".guan").on("click",function(){
     $(".box").hide();
      drawQipan();
      for(var i in qizi){
        var arr=i.split('_');
        var x=parseInt(arr[0]);
        var y=parseInt(arr[1]);
        luozi(x,y,qizi[i]);
      }

 })
//判断输赢
function M(a,b){
  return a+'_'+b;
}

function panduan(x,y,color){
  var row=1;col=1;zx=1;yx=1;
  var i;
  i=1;
  while(qizi[M(x+i,y)]==color){
    i++;
    row++;
  }
  i=1;
   while(qizi[M(x-i,y)]==color){
    i++;
    row++;
  }
   i=1;
  while(qizi[M(x,y+i)]==color){
    i++;
    col++;
  }
  i=1;
   while(qizi[M(x,y-i)]==color){
    i++;
    col++;
  }
   i=1;
  while(qizi[M(x+i,y+i)]==color){
    i++;
    zx++;
  }
  i=1;
   while(qizi[M(x-i,y-i)]==color){
    i++;
    zx++;
  }
    i=1;
  while(qizi[M(x+i,y-i)]==color){
    i++;
    yx++;
  }
  i=1;
   while(qizi[M(x-i,y+i)]==color){
    i++;
    yx++;
  }
return Math.max(row,col,zx,yx); 
}
//棋谱
 qipu=function(){
        ctx.save();
        ctx.font = "30px serif";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        var count=1;
        for(var i in qizi){
          var arr=i.split('_');
          if(qizi[i]=="black"){
            ctx.fillStyle="white";
          }
          else if(qizi[i]=="white"){
            ctx.fillStyle="black";
          }
           ctx.fillText(count++,l(parseInt(arr[0])),l(parseInt(arr[1])));
        }    
        ctx.restore();
         //收集画布中所有像素转换成一张图片（浏览器中可用图片：字符串形式存储的图片）
        if($(".box").find("img").length){
           $(".box").find("img").attr("src",canvas.toDataURL());
        }else{
          $("<img>").attr("src",canvas.toDataURL()).appendTo(".box");
        }
        if($(".box").find("a").length){
           $(".box").find("a").attr("href",canvas.toDataURL());
        }else{
           $("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box");
        }       
}
      //左边
    var left=0;
    function zuo(){
      ctx1.clearRect(0,0,200,200);
     ctx1.save();
     ctx1.translate(99,99);
     ctx1.rotate(Math.PI/180*6*left);
     ctx1.beginPath();
     ctx1.arc(0,0,5,0,Math.PI*2);
     ctx1.moveTo(0,5);
     ctx1.lineTo(0,30);
     ctx1.moveTo(0,-5);
     ctx1.lineTo(0,-60);
     ctx1.stroke();
     ctx1.closePath();
     ctx1.restore();
     left++;
    }
    zuo();
    var right=0;
     function you(){
     ctx2.clearRect(0,0,200,200);
     ctx2.save();
     ctx2.translate(99,99);
     ctx2.rotate(Math.PI/180*6*right);
     ctx2.beginPath();
     ctx2.arc(0,0,5,0,Math.PI*2);
     ctx2.moveTo(0,5);
     ctx2.lineTo(0,30);
     ctx2.moveTo(0,-5);
     ctx2.lineTo(0,-60);
     ctx2.stroke();
     ctx2.closePath();
     ctx2.restore();
     right++;
    }
    you();
    function render(){
      zuo();
    }
    function render1(){
      you();
    }
//选项
$(".xuanxiang img").hover(function(){
   var index=$(this).index();
  $(".xuanxiang img").eq(index).css("transform","scale(1.2)");
},function(){
   var index=$(this).index();
  $(".xuanxiang img").eq(index).css("transform","scale(1)");
})
//开始
var st=0;st1=0;
$('.xuanxiang img:eq('+2+')').on("click",function(){
     $(".set").show();
})
$(".cha").on("click",function(){
  $(".set").hide();
})
$(".col").on("click",false);
$(".col1").on("click",function(){
  if($(this).attr("id")){
    $(this).removeAttr("id");
    $("#ad").get(0).pause();
  }else{
    $(this).attr("id","huantu");
    $("#ad").get(0).play();
  }
})
$(".col2").on("click",function(){
  if($(this).attr("id")){
    $(this).removeAttr("id");
  }else{
    $(this).attr("id","huantu");
  }
})
$(".jt").on("click",function(){
  $(".set1").show();
})
$(".set1 .cha").on("click",function(){
   $(".set1").hide();
    $(".set").show();
})
$(".start").on("click",function(){
  $("#ad").get(0).play();
  $(".start").css("transform","rotate(360deg) scale(0)");
    $(".kaishi").delay(500).queue(function(){
    $(".kaishi").attr("id","active").dequeue();
  })
    $(".kaishi").delay(1700).queue(function(){
    $(".kaishi").removeAttr("id").dequeue();
  })
     $(".start").delay(1700).queue(function(){
     $(".start").hide().css("transform","rotate(0) scale(1)").dequeue();
  })
    st=0;
    st1=0;
})
//人机对战
$(".renji").on("click",function(){
   ai=true;
   flag=false;
  if(gemeState=="play"){
    return;
  }
   if(st==0){
     $(".start").show();
     st=1;
  }else{
    $(".start").hide();
    st=0;
  }
})
$(".renren").on("click",function(){
  ai=false;
  flag=true;
  if(gemeState=="play"){
    return;
  }
   if(st1==0){
     $(".start").show();
     st1=1;
  }else{
    $(".start").hide();
    st1=0;
  }
  $("#ad").get(0).play();
})
})