'use strict';
const fs = require('fs');
const readline = require('readline'); //この２行はNode.jsのモジュールを呼び出している。fsはファイルシステム。readlineはファイルを１行ずつ読み込む。
const rs = fs.createReadStream('./popu-pref.csv');　// popu-pref.csvからファイルの読み込みを行うStreamを設定。
const rl = readline.createInterface({input: rs, output: {} });　//それをreadlineオブジェクトのinputとして設定しrlオブジェクトを作成。
const prefectureDataMap = new Map(); //key: 都道府県 value:集計データのオブジェクト 集計データを格納する連想配列。

rl.on('line', lineString => {  //rlオブジェクトを利用する記載。rlオブジェクトでlineというイベントが発生したら、この無名関数を呼んでください。 
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if ( year === 2010 || year ===2015){
        let value = prefectureDataMap.get(prefecture);　//データの取得
        if(!value){　　//valueの値がFalsyのばあい、初期化する（初期値となるオブジェクトを代入する。）
            value = {
            popu10: 0,　　　//それぞれ、2010の人口、2015の人口、人口の変化率を表すプロパティ
            popu15: 0,
            change: null
            };
        }
        if (year === 2010){　//人口のデータを連想配列に保存。
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {　//保存したオブジェクトが取得される。
    for (let [key, value] of prefectureDataMap){     //for-of構文　MapやArrayの中身を of の前で与えられた変数に代入してforループと同じことができる。
        value.change = value.popu15 / value.popu10; 　//配列に含まれる要素を使いたいだけで、添字は不要な場合に便利。
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>{    //連想配列を普通の配列に変換。Arrayのsort関数を呼んで、無名関数を渡す。
        return pair2[1].change - pair1[1].change;                                    //sort1にたいして渡す関数を比較関数といい、並び替えのルールを決めることができる。
    });
    const rankingStrings = rankingArray.map(([key, value]) => { //Mapのキーと値が要素になった配列を要素「key, value」として受け取り、それを文字列に変換する。
        return(
            key +
            ':' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});
