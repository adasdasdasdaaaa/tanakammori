// ボス定義
const boss = {
  name: "将軍",
  hp: 20,
  atk: 3,
  attack: function(playerField){
    if(Math.random() < 0.1){
      playerField.forEach(c => c.hp -= this.atk);
      console.log("将軍が全体攻撃!");
    } else {
      const targets = playerField.filter(c => c.hp > 0);
      if(targets.length === 0) return;
      const target = targets[Math.floor(Math.random()*targets.length)];
      target.hp -= this.atk;
      console.log(`将軍が${target.name}を攻撃!`);
    }
    // 死亡判定
    for(let i=playerField.length-1; i>=0; i--){
      if(playerField[i].hp <= 0) playerField.splice(i,1);
    }
  }
};

// カード生成
function createCard(name){
  switch(name){
    case "くら寿司":
      return {name:"くら寿司", hp:6, atk:1};
    case "三菱":
      return {name:"三菱", hp:2, atk:1};
    case "尊師":
      return {
        name:"尊師",
        hp:7,
        atk:0,
        effect:function(field,boss){
          // 信者追加
          field.push({
            name:"信者",
            hp:1,
            atk:0,
            effect:function(b){ b.hp -=2; }
          });
          // ポワのサイン
          boss.hp -=3;
        }
      };
  }
}

// 初期手札
let hand = [createCard("くら寿司"), createCard("三菱"), createCard("尊師")];
let field = [];

// 手札表示
function updateHand(){
  const handDiv = document.getElementById("hand");
  handDiv.innerHTML="";
  hand.forEach((c,i)=>{
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // 尊師だけ画像を表示
    if(c.name === "尊師"){
      const img = document.createElement("img");
      img.src = "assets/sonshi.jpg"; // ← リポジトリに置いた画像
      cardDiv.appendChild(img);
    }

    const text = document.createElement("div");
    text.textContent = `${c.name} HP:${c.hp} ATK:${c.atk}`;
    cardDiv.appendChild(text);

    cardDiv.onclick = ()=>{ playCard(i); };
    handDiv.appendChild(cardDiv);
  });
}

// カード使用
function playCard(index){
  const card = hand.splice(index,1)[0];
  field.push(card);
  if(card.effect) card.effect(field,boss);
  boss.hp -= card.atk;
  updateHand();
  updateField();
  updateBoss();
}

// フィールド表示
function updateField(){
  const fieldDiv = document.getElementById("field");
  fieldDiv.innerHTML = "場のカード: "+field.map(c=>`${c.name} HP:${c.hp}`).join(", ");
}

// ボス表示
function updateBoss(){
  document.getElementById("boss").textContent = `将軍 HP:${boss.hp}`;
  if(boss.hp<=0) alert("ボス撃破!");
}

// 信者効果
function applyFaithers(){
  field.forEach(c=>{
    if(c.name==="信者") c.effect(boss);
  });
}

// ターン終了
document.getElementById("endTurn").onclick = ()=>{
  applyFaithers();
  boss.attack(field);
  updateField();
  updateBoss();
};

updateHand();
updateField();
updateBoss();
