define(function (require, exports, module) {
	require('../../plugin/simple.js');
	var cookie = require('../../tool/cookie.js');
	
	var $dom = {
		lgnBox: 	$('.act-login-block'),
		lgnBg: 		$('.act-float-bg'),
		paoma: 		$('.game-paoma'),
		gameStart: 	$('.game-start'),
		kjfs: 		$('.kjfs'),
		musicBtn: 	$('.game-music'),
		music: 		$('.music-src')[0],
		correct: 	$('.music-c')[0],
		wrong: 		$('.music-w')[0],
		totop: 		$('.totop'),

		openTip: 	$('.game-tip'),
		gameTipPop: $('.game-tip-pop'),
		closeTip:  	$('.close-game-tip')
	};

	var uid 		= $('.header-l').data('user');

	if($dom.paoma.find('li').length >=3){
		$dom.paoma.show();
		$dom.paoma.paomadeng();
	}
	$dom.totop.scrollShow(800);
	window.console && console.info('公平遊戲，請不要作弊唷');

	var mouse = function(obj) {
		this.type 		= obj.type;
		this.dong 		= obj.ele;
		this.dongNum 	= obj.num;
		this.mouseEle 	= '';
		this.init();
	};
	mouse.prototype = {
		init: function() {
			var _this = this;
			switch(this.type){
				case 0:
					this.mouseEle = '<div class="mouse mouse1"></div>';
					break;
				case 1:
					this.mouseEle = '<div class="mouse mouse711"></div>';
					break;
				case 2:
					this.mouseEle = '<div class="mouse mouselife"></div>';
					break;
				case 3:
					this.mouseEle = '<div class="mouse mousefamily"></div>';
					break;
			}
			this.show();
			this.dong.find('.mouse').one('click',function(e) {
				var $this = $(this);
				// if (!$this.hasClass('mouse2')) {
				// 	$this.addClass('mouse2');
					_this.click(e,$this);
				//}
			});
		},
		show: function() {
			var _this = this;
			this.dong.html(this.mouseEle);
			setTimeout(function() {
				_this.hide();
			},1000);
		},
		hide: function() {
			this.dong.empty();
			this.dong.removeClass('mouse2');
			control.hold[this.dongNum] = 0;
		},
		click: function() {}
	};

	var control = {
		gamewp: $('.mouse-wp'),
		dong: 	$('.mouse-wp li'),
		$score: $('.game-score span'),
		$time: 	$('.game-time span'),
		$undo: 	$('.undo-shadow'),
		score: 	0,
		hold: 	{},
		time: {
			play: 15.00,
			loop: 0,
			mouseLoop: 0,
		},
		personEv:{c:[],t:0,r:0},
		init: function(gametk) {
			var _this = this;
			_this.dong.each(function(i, v) {
				_this.hold[i] = 0;
				$(this).empty();
			});
			_this.score 		= 0;
			_this.hold  		= {};
			_this.time  		= {
				play: 15.0,
				loop: 0,
				mouseLoop: 0,
			}
			_this.personEv 	= {c:[],t:0,r:0,tk:gametk},
			_this.count 		= 0;

			_this.$score.html(_this.score);
			_this.$time.html(_this.time.play);
			_this.countDown();
			_this.mouseLoop();
			_this.$undo.show();
			playMusic();
		},
		countDown: function() {
			var _this = this;
			this.time.loop = setInterval(function() {
				_this.time.play -= 0.1;
				var a = _this.time.play.toFixed(1);
				_this.$time.html(a);
				if (_this.time.play <= 0) { //游戏结束
					_this.stopLoop();
					_this.$time.html("0.0");
				}
			}, 100);
		},
		changeScore: function(score) {
			this.$score.html(score);
		},
		mouseLoop: function() {
			var _this = this;
			_this.count ++;
			var j = this.dong.length;
			var x = Math.floor(Math.random() * j);
			var stopWhile = 0;
			while (this.hold[x]) {
				x = Math.floor(Math.random() * 10);
				stopWhile++;
				if (stopWhile >= 100) {
					break;
				}
			}
			this.hold[x] = 1;
			var mouseType = Math.floor(Math.random() * 4);
			var realMouse = new mouse({
				type: mouseType,
				ele: this.dong.eq(x),
				num: x,
			});
			realMouse.click = function(e,$this){

				if(this.type!=0){
					$dom.correct.play();
					if(_this.score>=60){
						_this.score = 60;
					}else{
						_this.score += 1;
					}
					$this.addClass('mouse2');
					_this.personEv.c.push(_this.time.play.toFixed(2));
				}else{
					$dom.wrong.play();
					if(_this.score>0){
						_this.score -= 1;
					}else{
						_this.score = 0;
					}
					$this.addClass('mouse3');
				}
				_this.changeScore(_this.score);
				if(!e.screenX){
					_this.personEv.t = 1;//1w-2w不作弊 3w-4w作弊
				}
			}
			this.time.mouseLoop = setTimeout(function() {
				_this.mouseLoop();
			}, 250);
		},
		stopLoop: function() {
			clearInterval(this.time.loop);
			clearInterval(this.time.mouseLoop);
			this.dong.empty();
			this.personEv.c 	+= '';
			this.personEv.c 	= this.personEv.c ? this.personEv.c : 0;
			this.personEv.r 	= this.personEv.t ? Math.floor(30000 + Math.random()*10000) : Math.floor(10000 + Math.random()*10000);
			this.personEv.t 	= this.score;
			this.$undo.hide();
			gameTimeEnd(this.personEv);
			stopMusic();
		}
	};
	function gaSendEvent(name){
		ga('send','event','2017超商活動',name,{nonInteraction:true});
	}

	//彈框需要
	var popneed = {
		scd: 0,
		cdEle: 		$('#game-st'),
		gamesd: 	$('.game-shadow'),
		poppz: 	 	$('.game-pz'),
		gamepop: 	$('#game-pop'),
		compop: 	$('.game-com-pop'),
		pzReusltpop:$('.prize-result'),
		kjfs: 		$('.pop-kjfs'),
		
		popclose: 	$('.gp-close')
	};
	//開始遊戲
	function startCd(fn,fn2){
		if(isLgn()){
			var data = {
				module: 'active2017',
				action: 'storeCheck'
			};
			$.ajax({
				type:'post',
				url: 'index.php',
				data: data,
				dataType:'json',
				success:function(result){
					if(result.status == 10){
						popneed.gamesd.show();
						var time 	= 3;
						popneed.cdEle.show().removeAttr('class').addClass('game-cd3');
						scd = setInterval(function(){
							time--;
							var tclass 	= 'game-cd'+time;
							popneed.cdEle.removeAttr('class').addClass(tclass);
							if(time == -1){
								clearInterval(scd);
								popneed.gamesd.fadeOut();
								popneed.cdEle.hide();
								fn(result.msg);
							}
						},1000);
					}else if(result.status == 102){
						showLgn();
						fn2();
					}else{
						alert(result.msg);
						fn2();
					}
				}
			});
		}else{
			fn2();
		}
	}
	function showLgn(){
		$dom.lgnBox.show();
		$dom.lgnBg.show();
	}
	function isLgn(){
		var fg = false;
		if(uid){
			fg = true;
		}else{
			showLgn();
		}
		return fg;
	}
	//遊戲錦囊
	function showTip(){
		popneed.gamesd.show();
		$dom.gameTipPop.show();
	}
	//關閉錦囊
	function closeTip(){
		popneed.gamesd.hide();
		$dom.gameTipPop.hide();
	}
	//轉換分數百分比
	function countScore(score){
		var s = '1%';
		if(score>50){
			s = '95%';
		}else if(score>40){
			s = '90%';
		}else if(score>30){
			s = '80%';
		}else if(score>20){
			s = '60%';
		}else if(score>10){
			s = '40%';
		}else{
			s = '20%';
		}
		return s;
	}
	// showpop({
	// 							cls:'game-success',
	// 							cnt:[
	// 								'您的成績為：<span style="font-size: 48px;">'+123+'分</span><br>',
	// 								'成功擊敗全臺<span>'+343+'</span>的玩家<br><br>',
	// 								'最佳成績為：'+234+'分<br>',
	// 								'今日還有<span>'+ 1 +'次</span>抽獎機會<br>'
	// 							].join(''),
	// 							btn:[
	// 								'<div class="gp-chou gp-btn">立即抽獎</div>',
	// 								'<div class="gp-back gp-btn">返回首頁</div>',
	// 								'<div class="gp-playAgain gp-btn">再玩一次</div>'
	// 							].join('')
	// 						});
	//發送成績
	function storeGame(postData){
		popneed.gamesd.hide();
		popneed.cdEle.hide();
		var data = {
			module: 'active2017',
			action: 'storeGame',
			s: 		postData.t,
			i: 		postData.c,
			n: 		postData.r,
			t:   	postData.tk
		};
		$.ajax({
			type:'post',
			url: 'index.php',
			data: data,
			dataType:'json',
			success:function(result){
				if(result.status == 10){
					if(data.s >= 20){ //挑戰成功
						if(result['msg']['draw_num'] > 0){
							showpop({
								cls:'game-success',
								cnt:[
									'您的成績為：<span style="font-size: 48px;">'+data.s+'分</span><br>',
									'成功擊敗全臺<span>'+countScore(data.s)+'</span>的玩家<br><br>',
									'最佳成績為：'+result['msg']['best_score']+'分<br>',
									'今日還有<span>'+result['msg']['draw_num']+'次</span>抽獎機會<br>'
								].join(''),
								btn:[
									'<div class="gp-chou gp-btn">立即抽獎</div>',
									'<div class="gp-back gp-btn">返回首頁</div>',
									'<div class="gp-playAgain gp-btn">再玩一次</div>'
								].join('')
							});
						}else{
							showpop({
								cls:'game-success',
								cnt:[
									'您的成績為：<span style="font-size: 48px;">'+data.s+'分</span><br>',
									'成功擊敗全臺<span>'+countScore(data.s)+'</span>的玩家<br><br>',
									'最佳成績為：'+result['msg']['best_score']+'分<br><br>',
									'獲取更多抽獎機會：<br>',
									'<a href="javascript:;" class="shareBtn">每日分享到FB獲1次&gt;&gt;</a><br>',
									'<a href="#paygl" class="csbtn">每日超商付款獲3次&gt;&gt;</a>',
								].join(''),
								btn:''
							});
						}
					}else{ //不成功
						showpop({
							cls:'game-failed',
							cnt:[
								'您的成績為：<span style="font-size: 48px;">'+data.s+'分</span><br>',
								'成績必須達到<span>20分</span>才能抽獎<br>',
								'最佳成績為：'+result['msg']['best_score']+'分<br>',
								'<span>下載8591App操作更簡單</span><br>',
							].join(''),
							btn:[
								'<a class="gp-back gp-btn" href="/news-app.html?aid=1378" target="_blank" style="color:#fff;">立即下載</a>',
								'<div class="gp-playAgain gp-btn">再玩一次</div>'
							].join('')
						});
					}
				}else if(result.status == 102){
					showLgn();
				}else{
					alert(result.msg);
				}
			}
		});
	}
	//抽獎接口
	var pzList = {"5":['pz-5','5元現金券'],"10":['pz-10','10元現金券'],"watch":['pz-xiaomi','小米手環2抽獎券'],"game":['pz-rtt','switch遊戲機抽獎券']};
	// showpz({
	// 						cnt:[
	// 							'<div class="com-bg '+pzList[5][0]+'">',
	// 								'<p>'+pzList[5][1]+'</p>',
	// 							'</div>'
	// 						].join(''),
	// 						btn:[
	// 							'<div class="gp-back gp-btn">返回首頁</div>',
	// 							'<div class="gp-playAgain gp-btn">再玩一次</div>'
	// 						].join('')
	// 					});
	function doChou(fn){
		$.ajax({
			type:'get',
			url: '/active2017-storeDraw.html',
			dataType:'json',
			success: function(result){
				if(result.status == 10){
					if(result['msg']['prize'] != 'thanks'){
						showpz({
							cnt:[
								'<div class="com-bg '+pzList[result['msg']['prize']][0]+'">',
									'<p>'+pzList[result['msg']['prize']][1]+'</p>',
								'</div>'
							].join(''),
							btn:[
								'<div class="gp-back gp-btn">返回首頁</div>',
								'<div class="gp-playAgain gp-btn">再玩一次</div>'
							].join('')
						});
					}else{
						showpop({
							cls:'game-buzhong',
							cnt:[
								'<p style="text-align:center;">居然沒中獎！怎麼能這樣...</p>'
							].join(''),
							btn:[
								'<div class="gp-back gp-btn">返回首頁</div>',
								'<div class="gp-playAgain gp-btn">再玩一次</div>'
							].join('')
						});
					}
				}else if(result.status == 102){
					showLgn();
				}else{
					alert(result.msg)
				}
				fn();
			}
		});
	}
	//fb分享
	function fbShare(fn){
		var url 		= 'https://www.8591.com.tw/active2017-payActive.html?aid=1376';
		var winShare 	= window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(url),"facebook_frm","height=550,width=560");
		
		var check 	 = setInterval(function(){  //檢測分享情況
			if(winShare.closed){
				clearInterval(check);
				var data = {
					module: 'active2017',
					action: 'storeFb'
				};
				$.ajax({
					type:'post',
					url: 'index.php',
					data: data,
					dataType:'json',
					success: function(result){
						if(result.status == 10){
							alert('您已獲得一次抽獎機會，再次挑戰成功即可使用');
							closepop();
						}else if(result.status == 102){
							showLgn();
						}else{
							alert(result.msg);
						}
						fn();
					}
				});
			}
		},1500);
	}
	//我的獎品
	function getMyPz(fn){
		var xjhtml = '';
		var cjhtml = '';
		$.ajax({
			type:'get',
			url: '/active2017-storePrize.html',
			dataType:'json',
			success: function(result){
				if(result.status == 10){
					for(var i in result['msg']){
						var pzdata = result['msg'][i];
						// console.log(pzList[pzdata['type']])
						// console.log(pzdata['type'])
						switch(pzdata['type']){
							case '5':
							case '10':
								xjhtml += [
									'<li class="com-bg '+pzList[pzdata['type']][0]+'">',
										'<span>*'+pzdata['num']+'</span>',
										'<p>'+pzList[pzdata['type']][1]+'</p>',
									'</li>'
								].join('');
							break;
							case 'game':
							case 'watch':
								cjhtml += [
									'<li class="com-bg '+pzList[pzdata['type']][0]+'">',
										'<span>*'+pzdata['num']+'</span>',
										'<p>'+pzList[pzdata['type']][1]+'</p>',
									'</li>'
								].join('');
							break;
						}
					}
					var html = [
						'<h3 class="c-title"><i></i>現金券</h3>',
						(xjhtml ? '<ul class="pz-box">'+xjhtml+'</ul>' : '<p class="pz-state">暫無數據</p>'),
						'<h3 class="c-title" style="margin-top:110px;"><i></i>抽獎券</h3>',
						(cjhtml ? '<ul class="pz-box">'+cjhtml+'</ul>' : '<p class="pz-state">暫無數據</p>'),
						'<a class="gp-btn" href="/userCenter-prizeInfo.html" target="_blank">前往查看</a>'
					].join('');

					showcompop({
						tle:'我的獎品',
						cnt: html
					});

				}else if(result.status == 102){
					showLgn();
				}else{
					alert(result.msg);
				}
				fn();
			}
		});
	}
	//時間到
	function gameTimeEnd(data){
		popneed.gamesd.fadeIn();
		popneed.cdEle.show().removeAttr('class').addClass('game-cdend');
		setTimeout(function(){
			storeGame(data);
		},2000);
	}
	//關閉彈框
	function closepop(){
		popneed.gamepop.hide();
		popneed.poppz.hide();
		popneed.compop.hide();
		popneed.kjfs.hide();
		popneed.gamesd.hide();
		popneed.pzReusltpop.hide();
		if(!$('.m1').html()){
			resetMouse();
		}
	}
	//成績彈框
	function showpop(option){
		closepop();

		var $cnt = popneed.gamepop.find('.gp-cnt .txt');
		var $btn = popneed.gamepop.find('.gp-btnbox');

		$cnt.html(option.cnt);
		$btn.html(option.btn);
		popneed.gamepop.removeAttr('class').addClass(option.cls);

		popneed.gamepop.show();
		var h = popneed.gamepop.height();
		popneed.gamepop.css('marginTop',-(h/2));
		popneed.gamesd.show();
	}
	//獎品彈框
	function showpz(option){
		closepop();

		var $cnt = popneed.poppz.find('.gp-cnt');
		var $btn = popneed.poppz.find('.gp-btnbox');

		$cnt.html(option.cnt);
		$btn.html(option.btn);

		popneed.poppz.show();
		popneed.gamesd.show();
	}
	//通用
	function showcompop(option){
		closepop();
		var $cnt = popneed.compop.find('.game-com-pop-cnt');
		var $tle = popneed.compop.find('.game-com-pop-tle');
		
		$cnt.html(option.cnt);
		$tle.html(option.tle);
		
		popneed.compop.show();
		var h = popneed.compop.height();
		popneed.compop.css('marginTop',-(h/2));
		popneed.gamesd.show();
	}
	function showKjfs(){
		popneed.kjfs.show();
		popneed.gamesd.show();
	}
	function resetMouse(){
		$('.m1').html('<div class="mouse mouse1"></div>');
		$('.m2').html('<div class="mouse mouse711"></div>');
		$('.m3').html('<div class="mouse mouse1"></div>');
		$('.m4').html('<div class="mouse mousefamily"></div>');
		$('.m5').html('<div class="mouse mouse1"></div>');
		$('.m6').html('<div class="mouse mouselife"></div>');
		$('.m7').html('<div class="mouse mouse1"></div>');
		$('.m8').html('<div class="mouse mouse711"></div>');
		$('.m9').html('<div class="mouse mouse1"></div>');
	}
	function playMusic(){
		$dom.musicBtn.addClass('doRoll');
		$dom.music.play();
	}
	function stopMusic(){
		$dom.musicBtn.removeClass('doRoll');
		$dom.music.pause();
		$dom.music.currentTime = 0;
	}
	

	//關閉彈框按鈕
	popneed.popclose.click(function(){
		closepop();
	});
	$('.gp-btnbox').on('click','.gp-back',function(){
		closepop();
	});
	$('.gp-btnbox').on('click','.csbtn',function(){
		gaSendEvent('超商付款按鈕');
		closepop();
	});
	//再玩一次
	$('.gp-btnbox').on('click','.gp-playAgain',function(){
		gaSendEvent('再玩一次按鈕');
		closepop();
		control.$undo.show();
		startCd(function(gametk){
			control.init(gametk);
		},function(){
			control.$undo.hide();
		});
	});
	//返回按鈕
	$('.gp-btnbox').on('click','.gp-back',function(){
		closepop();
	});
	//抽獎按鈕
	$('.gp-btnbox').on('click','.gp-chou',function(){
		gaSendEvent('立即抽獎按鈕');
		var $this = $(this);
		if(!$this.hasClass('undo')){
			$this.addClass('undo');
			doChou(function(){
				$this.removeClass('undo');
			});
		}
	});
	//分享按鈕
	$('.gp-cnt').on('click','.shareBtn',function(){
		gaSendEvent('FB分享按鈕');
		var $this = $(this);
		if(!$this.hasClass('undo')){
			$this.addClass('undo');
			fbShare(function(){
				$this.removeClass('undo');
			});
		}
	});
	$('.shareFb2').click(function(){
		gaSendEvent('FB分享按鈕');
		var $this = $(this);
		if(!$this.hasClass('undo')){
			$this.addClass('undo');
			fbShare(function(){
				$this.removeClass('undo');
			});
		}
	});
	//開始遊戲按鈕
	$('.game-start').click(function() {
		gaSendEvent('開始遊戲按鈕');
		control.$undo.show();
		startCd(function(gametk){
			control.init(gametk);
		},function(){
			console.log(2)
			control.$undo.hide();
		});
	});
	//我的獎品按鈕
	$('.getMyPz').click(function(){
		var $this = $(this);
		if(!$this.hasClass('undo')){
			$this.addClass('undo');
			getMyPz(function(){
				$this.removeClass('undo');
			});
		}
	});
	//遊戲錦囊
	$dom.openTip.click(function(){
		gaSendEvent('活動錦囊按鈕');
		showTip();
	});
	//關閉錦囊
	$dom.closeTip.click(function(){
		closeTip();
	});
	//開獎方式
	$dom.kjfs.click(function(){
		showKjfs();
	});
	$dom.musicBtn.click(function(){
		var $this = $(this);
		if($this.hasClass('doRoll')){
			stopMusic();
		}else{
			playMusic();
		}
	});
	$('.get-download').click(function(){
		$('.game-download').show();
		popneed.gamesd.show();
	});
	$('.game-download').click(function(){
		$('.game-download').hide();
		popneed.gamesd.hide();
	});
	$dom.totop.click(function(){
		$('html,body').animate({
			scrollTop:0
		},600);
	});
	
	$(function(){
		//GA 獨立訪客
		if(!cookie.get('payGA')){
			gaSendEvent('獨立訪客PC');
			cookie.set('payGA',1,{expires:15});
		}
	});
});