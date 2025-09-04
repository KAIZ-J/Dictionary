 const submitWord = document.getElementById("submit-word")
 const dialog = document.getElementById("dialog")
 let words10K = [];
 const searchSuggestions = document.getElementById("search-suggestions")
        const pronunciationsAudio = document.getElementById("pronunciationsAudio");
         function playAudio(){
            pronunciationsAudio.play();
        }
         async function getWords(){
            try{
                let response = await fetch ("/words-10k-english.json");
                let data = await response.json();
                words10K = data;
                console.log(words10K[3354])
            }
            catch(err){
                console.log("nooo")
            }
        }
        document.addEventListener("DOMContentLoaded",getWords)
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
        input.addEventListener("focusout",()=>{
            searchSuggestions.style.height="0px"
        })
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
            searchSuggestions.style.height="0px"
            dialog.close();
             
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
       function searching(elem){
         searchSuggestions.innerHTML=""
        if(elem.value!==""){
searchSuggestions.style.height="150px";
let length = elem.value.length;
let array = words10K.filter(el=>el.split("").splice(0,length).join("")===elem.value);
array.forEach(el=>{
    searchSuggestions.innerHTML+=`<div onclick="searchThis(this)"><i class="fa-solid fa-search"></i><span>${el}</span></div>`
})
        }
        else{
            searchSuggestions.style.height="0px"
        }
        
       }
       function searchThis(elem){
        let word = elem.children[1].textContent;
        submitWord.innerHTML=` <div id="loading">
    <span></span>
    <span></span>
    <span></span>
 </div>`
        getWordDictionary(word);
       }