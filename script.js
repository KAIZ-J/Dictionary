 const submitWord = document.getElementById("submit-word")
 const dialog = document.getElementById("dialog")
        const pronunciationsAudio = document.getElementById("pronunciationsAudio");
         function playAudio(){
            pronunciationsAudio.play();
        }
        const container = document.getElementById("container");
        function addContainer(obj){
              let indeX = obj.phonetics.findIndex(el=>el.text!==undefined);
            let index = obj.phonetics.findIndex(el=>el.audio!=="");
         pronunciationsAudio.setAttribute("src",`${obj.phonetics[index].audio}`)
            container.innerHTML="";
            container.innerHTML=`
            <div id="header">
    <h2><span>${obj.word}</span><span style="font-family: monospace;font-weight: 300;">${obj.phonetics[indeX].text}</span></h2>
    <button type="button" onclick="playAudio()"><i class="fa-solid fa-play"></i></button>
        </div>
        <hr id="line1">
            <div id="pos-defintions"> ${addDefintions(obj)}  </div> 
        `
        }
        function addDefintions(obj){
            let str = "";
            for(let i=0;i<obj.meanings.length;i++){
                str+=`<div id="${obj.meanings[i].partOfSpeech}"><i><b>${obj.meanings[i].partOfSpeech}</b></i>`
                    obj.meanings[i].definitions.forEach(el=>{
                        str+=`<div class="pos-individual">
 <p>${obj.meanings[i].definitions.indexOf(el)+1}.${el.definition}</p>
    <p style="font-size: 0.9rem;"><i>${el.example!==undefined?el.example:""}</i></p>
    </div>`;})
    str+=`${obj.meanings[i].synonyms.length>0?"<div class='synonyms'><span>Synonyms</span>":""}`
 obj.meanings[i].synonyms.forEach(el=>{
        str+=`<span class="synonym">${el}</span>`
    });
    str+=`${obj.meanings[i].synonyms.length>0?"</div><br>":""}`;
    str+=`${obj.meanings[i].antonyms.length>0?"<div class='antonyms'><span>Antonyms</span>":""}`
     obj.meanings[i].antonyms.forEach(el=>{
        str+=`<span class="antonym">${el}</span>`
    })
 str+=`${obj.meanings[i].antonyms.length>0?"</div>":""}`;

    str+=`</div>`
            }
            return str;
        }

        const form = document.getElementById("input-container");
        const input = document.getElementById("word");
        async function getWordDictionary(word){
            try{
      let response  = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      let data = await response.json();
      addContainer(data[0])
            }
            catch(err){
console.log("coundn't fetch")
alert("Please Enter Valid Word!!")
            };
            submitWord.innerHTML=`<i class="fa-solid fa-search search-btn"></i>`;
            input.value="";
            dialog.close()
        }
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            submitWord.innerHTML=` <div id="loading">
    <span></span>
    <span></span>
    <span></span>
 </div>`
            console.log(input.value + " & few seconds");
            getWordDictionary(input.value)
            
        });

      async function randomWord(){
        dialog.innerHTML=""
        dialog.showModal();
        dialog.innerHTML=`
        and the Random word is
        <p id="dotdot">loading</p>
        `
        try{
    let response = await fetch("https://random-word-api.vercel.app/api?words=1")
   let data = await response.json();
   let word = data[0];
    dialog.innerHTML=`
        and the Random word is
        <p>${word}</p>
        <p id="dotdot">loading defintions</p>
        `
   console.log(word + " & few seconds");
   getWordDictionary(word);
        }
        catch(err){
   console.log("cound't fetch");
   dialog.innerHTML=`Sorry a problem happened.
   <button type="button" onclick="randomWord()">Try Again</button>
    <button type="button" onclick="this.parentElement.close()">Close</button>
   `
        }
       }
       