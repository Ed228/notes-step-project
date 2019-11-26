if(document.getElementById("form")){
    document.getElementById('submit-btn').addEventListener("click", async ()=>{
        let res = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                title: document.getElementById("noteTitle").value,
                note: document.getElementById("note").value,
                date: Date.now()
            })
        });
        if(await res.ok) {
            await fetch("/");
            document.location.href = '/';
        } else {
            document.getElementById("error-message").innerText = 'Create note fail, something gone bad'
        }
    });
}
if(document.getElementById("notes")){
    const buttonsDelete = document.getElementsByClassName("delete");
    [].forEach.call(buttonsDelete, (val)=>{
        val.addEventListener('click', async (e)=>{
            e.preventDefault();
            let res = await fetch(`/api/notes/:${e.currentTarget.parentNode.id}`, {
                method: 'DELETE'
            });
            if(await res.ok && Number(await res.text())){
                val.parentNode.parentNode.remove();
            }
        })
    })
}
if(document.getElementById("detail-note")) {
    const expandTextarea = (textarea) => {
        while (textarea.scrollHeight > textarea.clientHeight  && !(textarea.scrollHeight === textarea.clientHeight)) {
                textarea.setAttribute("rows", (Number(textarea.getAttribute("rows")) + 1 ).toString())
            }
    };
    // const noteText = document.getElementById("note");
    // const noteTitle = document.getElementById("noteTitle");
    // while (noteText.scrollHeight > noteText.clientHeight  && !(noteText.scrollHeight === noteText.clientHeight)) {
    //     noteText.setAttribute("rows", (Number(noteText.getAttribute("rows")) + 1 ).toString())
    // }
    // while (noteTitle.scrollHeight > noteTitle.clientHeight  && !(noteTitle.scrollHeight === noteTitle.clientHeight)) {
    //     noteTitle.setAttribute("rows", (Number(noteTitle.getAttribute("rows")) + 1 ).toString())
    // }
    // [].forEach.call([noteTitle, noteText], (val)=>{
    //     val.addEventListener("focusin", (e)=>{
    //         e.currentTarget.classList.remove("textarea-redact-note");
    //     });
    //     val.addEventListener("focusout", (e)=>{
    //         e.currentTarget.classList.add("textarea-redact-note");
    //     })
    // });
    document.getElementById("delete-btn").addEventListener('click', async (e)=>{
        let res = await fetch(`/api/notes/:${e.currentTarget.getAttribute("dataid")}`, {
            method: 'DELETE'
        });
        if(await res.ok && Number(await res.text())){
            document.getElementById("detail-note").innerHTML = "";
            const deleteMessageWrapper = document.createElement('div');
            deleteMessageWrapper.classList.add('text-center');
            const messageOfDelete = document.createElement('p');
            messageOfDelete.classList.add("text-center", "text-primary", "h3");
            messageOfDelete.innerText = "This note is delete";
            const linkHome = document.createElement('a');
            linkHome.textContent = 'main page';
            linkHome.classList.add('btn', 'btn-outline-primary', 'btn-lg', 'mt-4');
            linkHome.href = '/';
            deleteMessageWrapper.appendChild(messageOfDelete);
            deleteMessageWrapper.appendChild(linkHome);
            document.getElementById("detail-note").appendChild(deleteMessageWrapper);
        } else {
            document.getElementById("error-message").innerText = `Cannot delete note, server response status ${res.status}`
        }
    });
    // document.getElementById("update-btn").addEventListener('click', async (e)=>{
    //     let res = await fetch(`/api/notes/:${e.currentTarget.getAttribute("dataid")}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json;charset=utf-8'
    //         },
    //         body: JSON.stringify({
    //             title: document.getElementById("noteTitle").value,
    //             note: document.getElementById("note").value,
    //             date: document.getElementsByClassName('card-subtitle')[0].value
    //         })
    //     });
    // });
    document.getElementById("edit-btn").addEventListener('click', async (e)=>{
       if(e.currentTarget.innerHTML === "Edit this note"){
           e.currentTarget.innerHTML = 'Confirm';
           [document.getElementById("card-title"), document.getElementById("card-text")].forEach((val, ind)=>{
               const textArea = document.createElement("textarea");
               textArea.classList.add("textarea-note");
               textArea.id = `textarea-note-${ind}`;
               textArea.setAttribute("rows", "1");
               textArea.value = val.innerText;
               document.querySelector(".card-body").insertBefore(textArea, val);
               val.remove();
               expandTextarea(document.getElementById(`textarea-note-${ind}`));
           })
       } else if (e.currentTarget.innerHTML === 'Confirm') {
           e.currentTarget.innerHTML = "Edit this note";
           let res = await fetch(`/api/notes/:${e.currentTarget.getAttribute("dataid")}`, {
                       method: 'PUT',
                       headers: {
                           'Content-Type': 'application/json;charset=utf-8'
                       },
                       body: JSON.stringify({
                           _id: e.currentTarget.getAttribute("dataId"),
                           title: document.getElementById("textarea-note-0").value,
                           note: document.getElementById("textarea-note-1").value,
                           date: document.getElementById('card-date').innerText
                       })
                   });
           if(await res.ok){
           [].forEach.call(document.querySelectorAll(".textarea-note"), (val, ind)=>{
                if(ind === 0){
                    const h5 = document.createElement("h5");
                    h5.classList.add("card-title");
                    h5.id = "card-title";
                    h5.innerText = val.value;
                    document.querySelector(".card-body").insertBefore(h5, val);
                    val.remove();
                } else {
                    const p = document.createElement("p");
                    p.classList.add("card-text");
                    p.id = "card-text";
                    p.innerText = val.value;
                    document.querySelector(".card-body").insertBefore(p, val);
                    val.remove();
                }
            })
           }
       }
    })
}