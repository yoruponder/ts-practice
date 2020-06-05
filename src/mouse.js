define(function(require, exports, module) {
	window.console && console.log('公平遊戲，請不要作弊唷');
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
		score: 	0,
		hold: 	{},
		time: {
			play: 3.00,
			loop: 0,
			mouseLoop: 0,
		},
		personEv:{c:[],t:0,r:0},
		init: function() {
			var _this = this;
			this.dong.each(function(i, v) {
				_this.hold[i] = 0;
				$(this).empty();
			});
			this.$score.html("0");
			this.$time.html(this.time.play);
			this.countDown();
			this.mouseLoop();
		},
		countDown: function() {
			var _this = this;
			this.time.loop = setInterval(function() {
				_this.time.play -= 0.01;
				var a = _this.time.play.toFixed(2);
				_this.$time.html(a);
				if (_this.time.play <= 0) { //游戏结束
					_this.stopLoop();
					_this.$time.html("0.00");
				}
			}, 10);
		},
		changeScore: function(score) {
			this.$score.html(score);
		},
		mouseLoop: function() {
			var _this = this;
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
				_this.personEv.c.push(_this.time.play.toFixed(2));

				if(mouseType!=0){
					_this.score += 1;
					$this.addClass('mouse2');
				}else{
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
			this.personEv.r 	= this.personEv.t ? Math.floor(30000 + Math.random()*10000) : Math.floor(10000 + Math.random()*10000);
			console.log(this.personEv)
			gameTimeEnd();
		}
	};
	$('.game-start').one('click', function() {
		startCd(function(){
			control.init();
		});
	});

	//彈框需要
	var popneed = {
		scd: 0,
		cdEle: 		$('#game-st'),
		gamesd: 	$('.game-shadow'),

		gamepop: 	$('#game-pop'),
		popclose: 	$('.gp-close'),

		poppz: 	 	$('.game-pz')
	};
	function startCd(fn){
		popneed.gamesd.fadeIn();
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
				fn();
			}
		},1000);
	}
	function gameTimeEnd(){
		popneed.gamesd.fadeIn();
		popneed.cdEle.show().removeAttr('class').addClass('game-cdend');
		setTimeout(function(){
			//請求後端
		},2000);
	}
	function showpop(option){
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
	function closepop(){
		popneed.gamepop.hide();
		popneed.poppz.hide();
		popneed.gamesd.hide();
	}
	function showpz(option){
		var $cnt = popneed.poppz.find('.gp-cnt');
		var $btn = popneed.poppz.find('.gp-btnbox');

		$cnt.html(option.cnt);
		$btn.html(option.btn);

		popneed.poppz.show();
		popneed.gamesd.show();
	}
	showpz({
		cnt:[
			'<div class="com-bg pz-5">',
				'<p>switch遊戲機抽奖券</p>',
			'</div>'
		].join(''),
		btn:[
			'<div class="gp-back gp-btn">返回首頁</div>',
			'<div class="gp-playAgain gp-btn" style="float:right;">再玩一次</div>'
		].join('')
	});




	popneed.popclose.click(function(){
		closepop();
	});
	popneed.gamepop.on('click','.gp-back',function(){
		closepop();
	});
	popneed.gamepop.one('click','.gp-playAgain',function(){
		closepop();
		startCd(function(){
			control.init();
		});
	});
	popneed.poppz.one('click','.gp-playAgain',function(){
		closepop();
		startCd(function(){
			control.init();
		});
	});
	popneed.poppz.on('click','.gp-back',function(){
		closepop();
	});




	// showpop({
	// 	cls:'game-buzhong',
	// 	cnt:[
	// 		// '您的成績為：<span style="font-size: 48px;">90分</span><br>',
	// 		// '成功擊敗全國<span>99.62%</span>的玩家<br><br>',
	// 		// '最佳成績為：282分<br>',
	// 		// '今日還有<span>2次</span>抽獎機會<br>'
	// 		'<p style="text-align:center;">居然沒中獎！怎麼能這樣...</p>'
	// 	].join(''),
	// 	btn:[
	// 		// '<div class="gp-chou gp-btn">立即抽獎</div>',
	// 		'<div class="gp-back gp-btn">返回首頁</div>',
	// 		'<div class="gp-playAgain gp-btn" style="float:right;">再玩一次</div>'
	// 	].join('')
	// });

});