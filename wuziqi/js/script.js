window.onload=function(){
	var chess=document.getElementById("can");
	var context=chess.getContext("2d");
	var chessImages=new Image();
	chessImages.src="../images/chess.gif";
	chessImages.onload=function(){
		context.drawImage(chessImages,0,0,450,450);
		chessBorder();
	}
	chess.onclick=dropChess;
	onceAgin.onclick=onceagin;
}

//画棋盘
function chessBorder(){
	var chess=document.getElementById("can");
	var context=chess.getContext("2d");
	context.strokeStyle="#bfbfbf";
	for(var i=0;i<15;i++){
			context.moveTo(15+i*30,15);
			context.lineTo(15+i*30,435);
			context.stroke();
			context.moveTo(15,15+i*30);
			context.lineTo(435,15+i*30);
			context.stroke();
	}
}
//i表示x，j表示y,me表示黑子
function createChess(i,j,me){
	var chess=document.getElementById("can");
	var context=chess.getContext("2d");
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#d1d1d1");
		gradient.addColorStop(1,"#f9f9f9");
	}	
	context.fillStyle=gradient;
	context.fill();
}
//这两个作为全局变量
var me=true;
var chessBoard=[];
for(var l=0;l<15;l++){
	chessBoard[l]=[];
	for(var m=0;m<15;m++){
		chessBoard[l][m]=0;
  }
}
//赢发数组
var wins=[];
var count=0;//定义赢法种类
var myWin=[];
var computerWin=[];
var over=false;
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
//横线里的赢法
for (var i = 0; i < 15; i++) {
	for (var j=0;j<11;j++) {
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true
		}
	count++;
	}
}
//竖线里的赢法
for (var i = 0; i <15; i++) {
	for (var j=0;j<11;j++) {
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true
		}
	count++;
	}
}
//斜线里的赢发
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
	count++;
	}

}
//反斜线的赢法
for(var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}
console.log(count);

//初始化我方和计算机的赢法统计数组
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}
//落子
function dropChess(event){
	if(over){
		return;
	}
	if(!me){//当不是我方下棋是直接跳出
		return;
	}
	var e=event||window.event;
	var left=e.offsetX;
	var top=e.offsetY;
	var i=Math.floor(left/30);
	var j=Math.floor(top/30);
	if(chessBoard[i][j]==0){
		createChess(i,j,me);
		chessBoard[i][j]=1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
			    computerWin[k]=6;
				if(myWin[k]==5){
					alert("你赢了");
					over=true;
				}
		}
		
	}
	if(!over){
		me=!me;
		computerAI();
	}
}
}
function computerAI(){
	var myScore=[];
	var computedScore=[];
	var max=0;
	var u=0,v=0;
	for(var i=0;i<15;i++){
		myScore[i]=[];
	    computedScore[i]=[];
	    for(var j=0;j<15;j++){
	    	myScore[i][j]=0;
	    	computedScore[i][j]=0;
	    }
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						//电脑
						if(computerWin[k]==1){
							computedScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computedScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computedScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computedScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computedScore[i][j]>computedScore[u][v]){
						u=i;
					    v=j;
					}
				}
				if(computedScore[i][j]>max){
					max=computedScore[i][j];
					u=i;
					v=j;
				}else if(computedScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
					    v=j;
					}
				}
			}
		}
	}
	createChess(u,v,me);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){
			    computerWin[k]++;
			    myWin[k]=6;
			    if(computerWin[k]==5){
					alert("电脑赢了");
					over=true;
				}
		}
    }
	if(!over){
		me=!me;
	}
}
function onceagin(){
	window.history.go(0);
}