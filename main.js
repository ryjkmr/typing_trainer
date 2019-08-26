
window.onload = function () {
  //入力欄を取得
  const inputArea = document.getElementById("input");//答えを入力するdiv
  const question = document.getElementById("question");//問題を表示するdiv
  const original = document.getElementById("original");//オリジナル問題を入れるtextarea
  const loadOriginalBtn = document.getElementById("loadOriginal");//オリジナル問題を読み込むボタン
  const skipBtn = document.getElementById('skip');//この問題はスキップボタン
  const errorMsg = document.getElementById('errorMsg');//エラー表示のdiv
  loadOriginalBtn.disabled = 1;
  let questionText = '';
  let textJustBefore = '';//直前の問題を格納する変数

  //オリジナル問題が入力されたらボタンをアクティブにする
  original.oninput = () => {
    console.log('changed');
    if (original.value.trim().length > 0) {
      loadOriginalBtn.disabled = 0;
    } else { loadOriginalBtn.disabled = 1; }
  }

  //オリジナル問題を使用ボタンの処理
  loadOriginalBtn.onclick = () => {
    data_array = original.value.split(/\r\n|\r|\n/).filter(a => a);
    showRandomText();
  }

  //スキップボタンの処理
  skipBtn.onclick = () => {
    showRandomText();
  }


  // キー入力毎に問題文と照らし合わせる。アロー関数を使うとthisがUndefinedになっちゃう
  inputArea.oninput = function () {
    const questionText = question.textContent;
    const inputText = this.textContent.trim();
    //記号類をエスケープ。空白の数は問わないように設定
    const reg = new RegExp(inputText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+'));
    //正しく入力できた部分の色を変える
    const replaceText = '<span class="match">' + inputText + '</span>';
    question.innerHTML = questionText.replace(reg, replaceText);
    //正解したら新しい問題を表示
    if (question.textContent.trim() === inputText) {
      showRandomText();
    }
  }

  //問題を読み込んでスタート
  loadQuestionFromFile('test.txt');

  // -------------------------　以下は関数定義

  function showRandomText() {//問題をランダムに表示する関数
    var len = data_array.length;//問題の数を取得
    //console.log(len);
    if (len === 1) {
      question.textContent = data_array[0];
    }//1問だけの繰り返しもできるようにする処理
    else {
      //2問以上ある時は、同じ問題が続かないようにする
      while (questionText == textJustBefore) {//直前と違う問題になるまでやる
        var randNum = Math.floor(Math.random() * len);//0〜配列長の乱数を生成
        questionText = data_array[randNum];
      }
      question.textContent = questionText;//新しい問題を表示
      textJustBefore = questionText;//最新の問題を保存	
    }
    inputArea.textContent = '';//入力欄をクリア
    inputArea.focus();//入力エリアにフォーカスして待機
  }

  function loadQuestionFromFile(fileName) {
    const request = new XMLHttpRequest();
    request.open("get", fileName, true);
    request.onload = () => {
      // とりあえず全データを取得
      const rawData = request.responseText;
      // 改行で配列に分割、空配列を削除
      data_array = rawData.split(/\r\n|\r|\n/).filter(a => a.trim());
      //各問題前後の空白を削除
      data_array.forEach((value, index, array) => {
        array[index] = array[index].trim();
      });
      //問題を表示してゲームスタート
      showRandomText();
    };
    request.onerror = (e) => {
      errorMsg.textContent = '問題データファイルの読み込みに失敗しました。Chromeのローカル環境で動かす場合は、Chromeの設定を変更してCross Origin Requestを許可する必要があります。問題数が少ないローカルモードで動作しています';
      data_array = loadQuestion();//ローカルモードのデータを読み込み
      showRandomText();

    }
    request.send(null);
  }

  function loadOriginalQuestion() {
    // div"original"に入っているテキストを取得して、改行で配列に分割、空の配列を削除
    const q = original.textContent.split(/\r\n|\r|\n/).filter(a => a.trim());
    return q;
  }

  //問題文を返す関数。問題を外部ファイルから読み込めなかった時に使用
  function loadQuestion() {
    const q = [
      "function fn(n) {  };",
      "const HOST_NAME = 'HOST';",
      "let result = 1;",
      "for (let i = 1; i <= n; i++) { }",
      "return result;",
      "let obj = {};",
      "console.log('result:' + result);",
      "'use strict';",
      "array.forEach((value, index) => { });",
      "array.map((v) => { return v * v });",
      "let array = ['a', 'b', 'c'];",
      "array.push('new');",
      "const objArr = [{ name: 'a', number: 1 }, { name: 'b', number: 2 }];",
      "const array = ['ja', 'en'];",
      "const newArray = array.map(a => { });",
      "var fn = (a, b) => { }",
      "let newStr = str.replace(/[A-Z]/g);",
      "array.filter((value) => { });",
      "if (flag === 0){}",
      "if (flag !== 0){}",
      "if (flag >== 0){}",
      "if (flag <== 0){}",
      "if (a === 0 | b===0){}",
      "if (flag >== 0 && b ====0){}",
      "str = a===b ? 'same' : 'not';"

    ];
    return q;
  }
}