'use strict';
window.onload = function () {
  let data_array = [];
  const inputArea = document.getElementById("input");//答えを入力するdiv
  const question = document.getElementById("question");//問題を表示するdiv
  const original = document.getElementById("original");//オリジナル問題を入れるtextarea
  const loadOriginalBtn = document.getElementById("loadOriginal");//オリジナル問題を読み込むボタン
  loadOriginalBtn.disabled = 1;//オリジナル問題が空の時は押せないように
  const skipBtn = document.getElementById('skip');//この問題はスキップボタン
  const errorMsg = document.getElementById('errorMsg');//エラー表示のdiv
  const modeBtn = document.getElementById('modeBtn');//問題モード選択ボタン

  let questionText = '';
  let textJustBefore = '';//直前の問題を格納する変数

  //オリジナル問題が入力されたらボタンをアクティブにする
  original.oninput = () => {
    if (original.value.trim().length > 0) {
      loadOriginalBtn.disabled = 0;
    } else { loadOriginalBtn.disabled = 1; }
  }

  //オリジナル問題を使用ボタンの処理
  loadOriginalBtn.onclick = () => {
    data_array = original.value.split(/\r\n|\r|\n/).filter(a => a);
    //ラジオボタンのチェックを外す
    for (const element of document.getElementsByName('mode')) {
      element.checked = false;
    }
    showRandomText();
  }

  //問題モードの切り替え
  modeBtn.onchange = function () {
    const mode = this.mode.value;
    console.log('changed: ' + mode);
    if (mode) { loadQuestionFromFile(mode); }
  }

  //スキップボタンの処理
  skipBtn.onclick = () => {
    showRandomText();
  }


  // キー入力毎に問題文と照らし合わせる。※アロー関数を使うとthisがUndefinedになっちゃう！？
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

  //設定が終わったら、とりあえずノーマルモードの問題を読み込んでスタート
  loadQuestionFromFile('normal');

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

  //外部ファイルから問題を読み込む関数
  //XMLHttpRequestがブラウザのセキュリティ制限にかかった時はコード内に記述したデータを使う
  function loadQuestionFromFile(mode) {
    const fileName = mode + '.txt';
    console.log(fileName);
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
      //過去のエラーメッセージを削除
      errorMsg.innerHTML = '';
      //問題を表示してゲームスタート
      showRandomText();
    };
    //読み込みできなかった時の処理
    request.onerror = (e) => {
      errorMsg.innerHTML = `WARNING: データファイルの読み込みに失敗しました。プログラム内蔵のデータを使うローカルモードで動作しています。<br>
      おそらくデータファイルへのアクセスがブラウザのセキュリティ制限に引っかかっています。<br>
      対策：1.ブラウザの設定を変更する 2.webサーバー上で起動する 3.<a href="https://ryjkmr.github.io/typing_trainer/">GitHub Pages</a>にアクセスする`;
      data_array = loadQuestionLocal(mode);//ローカルモードのデータを読み込み
      showRandomText();
    }
    request.send(null);
  }


  //問題文を返す関数。データを外部ファイルから読み込めなかった時に使用
  function loadQuestionLocal(mode) {
    let q = {};
    q.symbol = [
      "===",
      "!==",
      "<=",
      "<",
      ">",
      ">=",
      "+=",
      "-=",
      "{}",
      "[]",
      ":",
      ";",
      "' '",
      "` `",
      "()",
      "\n",
      "/ /",
      "a,b",
      "&",
      "&&",
      "%",
      "${}",
      "#",
      "-",
      "+",
      "++",
      "*",
      "**",
      "--",
      "^",
      "/",
      "|",
      "||",
      "@",
      "=>",
      "()=>",
      "=()=>"
    ];

    q.easy = [
      "// comment",
      "/* comment */",
      "const n = 1;",
      "   let n = 1;",
      "const s = 'a';",
      "let s = 'a';",
      "console.log(a);",
      "const",
      "let",
      "true",
      "false",
      "function() { }",
      "null",
      "`${a}`",
      "const a = [];",
      "/\d+/;",
      "let num = 1;",
      "num++;",
      "if (i === 0) { }",
      "for ()",
      "array.forEach()",
      "array.map()",
      "obj = {};",
      "array = [];",
      "'use strict';"
    ];

    q.normal = [
      "-",
      "--",
      "-=",
      ";",
      ":",
      "!==",
      "' '",
      "'use strict';",
      "()",
      "()=>",
      "[]",
      "{}",
      "@",
      "*",
      "**",
      "/",
      "/ /",
      "/* comment */",
      "// comment",
      "/\d+/;",
      "\n",
      "&",
      "&&",
      "#",
      "%",
      "` `",
      "`${ a }`",
      "`result: ${a}`",
      "^",
      "+",
      "++",
      "+=",
      "<",
      "<=",
      "=()=>",
      "===",
      "=>",
      ">",
      ">=",
      "|",
      "||",
      "${}",
      "a,b",
      "array = [];",
      "array.filter((value) => { });",
      "array.forEach((value, index) => { });",
      "array.forEach((value) => { console.log(value);});",
      "array.forEach()",
      "array.map((v) => { });",
      "array.map((v) => { return v * v });",
      "array.map()",
      "array.pop();",
      "array.push('new');",
      "array.reverse();",
      "array.shift();",
      "array.sort((a,b)=> b-a);",
      "array.sort();",
      "array.splice(index,num);",
      "array.unshift(value);",
      "console.info('info');",
      "console.log('result:' + result);",
      "console.log(a);",
      "console.log(new Date());",
      "console.log(result);",
      "const",
      "const a=[];",
      "const Alph_and_Num = /\w/g;",
      "const arr = str.split(',');",
      "const arr = str.split(/\r\n|\r|\n/);",
      "const array = ['a', 'b'];",
      "const array_x_2 = array.map(value => value * 2);",
      "const array2 = array1.slice(1, 4);",
      "const array3 = array1.concat(array2);",
      "const columns = lineString.split(',');",
      "const doreka = /[abc]/g;",
      "const endOfLines = /a$/m;",
      "const entries=  Object.entries(obj);",
      "const firstOfLines = /^a/m;",
      "const fn = () => { };",
      "const fn = (x, y) => { };",
      "const fn = (x) => { };",
      "const fn = x => { };",
      "const fn = x => { return x * 2; };",
      "const fn = x => x * 2;  ",
      "const HOST_NAME = 'HOST';",
      "const index = array.indexOf(value);",
      "const keys = Object.keys(obj);",
      "const komoji = /[a-z]/g;",
      "const map = new Map();",
      "const n = 1;",
      "const newArray = array.filter((value, index, array) => { });",
      "const newArray = array.map((a) => { return a * 2; });",
      "const Not_Alph_and_Num = /\W/g;",
      "const not_number = /\D/g;",
      "const not_space = /\S/g;",
      "const now = new Date();",
      "const num = Number(str);",
      "const num = parseInt(str);",
      "const number = /[0-9]/g;",
      "const number = /\d/g;",
      "const numbers3 = /[0-9]{3}/;",
      "const numbers3orMore = /[0-9]{3,}/;",
      "const obj = { name: 'a', age: 12 };",
      "const obj = JSON.parse(json);",
      "const oneOfThem = /[abc]/g;",
      "const oomoji = /[A-Z]/g;",
      "const pos = str.indexOf('a');",
      "const result = array.sort((a, b) => { a - b });",
      "const s = 'a';",
      "const space = /\s/g;",
      "const str = JSON.stringify(obj);",
      "const str = String(num);",
      "const value = true ? 'A' : 'B';",
      "const values = Object.values(obj);",
      "do { } while (x < 10);",
      "false",
      "for (const value of array) { }",
      "for (let i = 0; i < array.length; i++) { }",
      "for (let i = 1; i < 100; i++) { }",
      "for (let i = 1; i <= n; i++) { }",
      "for()",
      "function fn(...args) { }",
      "function fn(n) { }",
      "function myFunc(n) { }",
      "function(){}",
      "i--",
      "i++",
      "if (!a) { }",
      "if (a !== b) { }",
      "if (a && b) { }",
      "if (a < b) { }",
      "if (a <= b) { }",
      "if (a === b) { }",
      "if (a > b) { }",
      "if (a >= b) { }",
      "if (a || (b && c)) {}",
      "if (a || b) { }",
      "if (a) { } else { }",
      "if(array.includes(value)){};",
      "if(i === 0){}",
      "let",
      "let amari = a % b;",
      "let array = ['a', 'b'];",
      "let hikizan = a - b;",
      "let kaijo = a ** b;",
      "let kakezan = a * b;",
      "let n = 1;",
      "let num = 1;",
      "let obj = {};",
      "let result = 1;",
      "let s = 'a';",
      "let tashizan = a + b;",
      "let warizan = a / b;",
      "map.get(key);",
      "map.set(key, value);",
      "newStr = str.slice(1, 5);",
      "null",
      "num++;",
      "obj = {};",
      "obj.method = function() { };",
      "obj.name",
      "return result;",
      "setTimeout(() => { }, delay);",
      "str = str.match(pattern);",
      "str = str.replace(a, b);",
      "str = str.trim();",
      "switch (a) { case 1: break; default: break;}",
      "true",
      "try { } catch (err) { }",
      "var fn = (a, b) => { }",
      "while (x < 10) { x += 1; }"
    ];
    return q[mode];
  }
}