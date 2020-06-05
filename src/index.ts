import "./less";

interface MusicElement {
  bg: HTMLAudioElement;
  correct: HTMLAudioElement;
  wrong: HTMLAudioElement;
}
interface GameElement {
  countdown: JQuery<HTMLElement>;
  shadow: JQuery<HTMLElement>;
  hole: JQuery<HTMLElement>;
  score: JQuery<HTMLElement>;
  time: JQuery<HTMLElement>;
  undo: JQuery<HTMLElement>;
  [propName: string]: JQuery<HTMLElement>;
}
interface MouseOption {
  type: number,
  hole: JQuery<HTMLElement>,
  hole_idx: number
}
function sleepTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class MouseGame {
  public $game_ele: GameElement = {
    countdown: $('#game-start-time'),
    shadow: $('.game-shadow'),
    hole: $('.mouse-wp li'),
    score: $('.game-score span'),
    time: $('.game-time span'),
    undo: $('.undo-shadow'),
  };
  public $music_ele: MusicElement = {
    bg: $('.music-src')[0] as HTMLAudioElement,
    correct: $('.music-c')[0] as HTMLAudioElement,
    wrong: $('.music-w')[0] as HTMLAudioElement
  };
  static holes = {};
  static score: number = 0;
  start_count_down: number = 3;
  play_time: number = 15;
  
  async start() {
    MouseGame.score = 0;
    this.$game_ele.hole.empty();
    this.$game_ele.score.html(MouseGame.score + '');
    this.$game_ele.time.html(this.play_time + '.0');
    this.$game_ele.shadow.show();
    this.$game_ele.countdown.show().removeAttr('class').addClass('game-cd3');
    await this.startCountDown();
    this.gameTimeCountDown();
    this.playMusic();
    this.mouseLoop();
    this.$game_ele.undo.show();
  }
  async startCountDown(){
    await sleepTime(1000);
    if(this.start_count_down <= 0){
      this.$game_ele.shadow.hide();
      this.$game_ele.countdown.hide();
      return 1;
    }else{
      this.start_count_down--;
      this.$game_ele.countdown.removeAttr('class').addClass(`game-cd${this.start_count_down}`);
      await this.startCountDown();
    }
  }
  async gameTimeCountDown() {
    this.play_time -= 0.1;
    if (this.play_time <= 0) { //游戏结束
      this.endGame();
      this.$game_ele.time.html("0.0");
      return;
    }
    this.$game_ele.time.html(this.play_time.toFixed(1));
    await sleepTime(100);
    this.gameTimeCountDown();
  }
  async mouseLoop() {
    if(this.play_time <= 0){
      return;
    }
    let j = this.$game_ele.hole.length;
    let x = Math.floor(Math.random() * j);
    let stopWhile = 0;
    while (MouseGame.holes[x]) {
      x = Math.floor(Math.random() * 10);
      stopWhile++;
      if (stopWhile >= 100) {
        break;
      }
    }
    MouseGame.holes[x] = 1;
    new Mouse({
      type: Math.floor(Math.random() * 4),
      hole: this.$game_ele.hole.eq(x),
      hole_idx: x,
    });
    await sleepTime(250);
    this.mouseLoop();
  }
  async endGame() {
    this.$game_ele.hole.empty();
    this.$game_ele.undo.hide();
    this.$game_ele.shadow.fadeIn();
    this.$game_ele.countdown.show().removeAttr('class').addClass('game-cdend');
    this.stopMusic();
    await sleepTime(2000);
    this.$game_ele.shadow.hide();
    this.$game_ele.countdown.hide()
  }
  playMusic(){
    this.$music_ele.bg.play();
  }
  stopMusic(){
    this.$music_ele.bg.pause();
    this.$music_ele.bg.currentTime = 0;
  }
  addScore() {
    MouseGame.score ++;
    this.$game_ele.score.html(MouseGame.score + '');
  }
  minusScore() {
    if(MouseGame.score > 0){
      MouseGame.score --;
    }else{
      MouseGame.score = 0;
    }
    this.$game_ele.score.html(MouseGame.score + '');
  }
}

class Mouse extends MouseGame {
  type: number;
  $hole: JQuery<HTMLElement>;
  hole_idx: number;
  mouse_html: string;
  mouse_show_time: number = 1000;

  constructor({type, hole, hole_idx } : MouseOption) {
    super();
    let mouse_all_type = [
      '<div class="mouse mouse1"></div>',
      '<div class="mouse mouse711"></div>',
      '<div class="mouse mouselife"></div>',
      '<div class="mouse mousefamily"></div>'
    ];
    this.type = type;
    this.$hole = hole;
    this.hole_idx = hole_idx;
    this.mouse_html = mouse_all_type[type];
    this.initMouse();
  }
  initMouse() {
    let _this = this;

    this.show();
    this.$hole.find('.mouse').one('click', function() {
      console.log(_this)
      if(_this.type != 0 ){
        _this.$music_ele.correct.play();
        _this.addScore();
        $(this).addClass('mouse2');
      }else{
        _this.$music_ele.wrong.play();
        _this.minusScore();
        $(this).addClass('mouse3');
      }
    });
  }
  async show() {
    this.$hole.html(this.mouse_html);
    await sleepTime(this.mouse_show_time);
    this.hide();
  }
  hide() {
    this.$hole.empty();
    this.$hole.removeClass('mouse2');
    MouseGame.holes[this.hole_idx] = 0;
  }
}

//開始遊戲按鈕
$('.game-start').click(function() {
  new MouseGame().start();
});