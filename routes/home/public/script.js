let usernameInput = document.getElementById("username");

document.querySelector("form").onsubmit = function (e){
    e.preventDefault();
    let username = usernameInput.value;

    if(username.length < 1){
        alert("Invalid username: less than 1 character")
        return;
    }
    if(username.length > 20){
        alert("Invalid username: higher than 20 character")
        return;
    }
    $.post({
        url: "/api/user/register",
        data: {username},
        success: async function (data){
            if(data.code !== 200){
                alert(data.message)
            }else{
                window.location = "/";
            }
        }
    });
}