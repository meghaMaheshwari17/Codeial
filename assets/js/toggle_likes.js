
// creating a class to toggle likes when a link is clicked, using ajax 
class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement;
        this.toggleLike(); 
    }
    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self =this; 
            // sending ajax request
            $.ajax({
                type:'POST',
                url:$(self).attr('href')
            }).done(function(data){
                let likesCount=parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted){ //checking if deleted data got sent from likes_controller.js
                    likesCount-=1;
                }else{
                    likesCount+=1;
                }
                $(self).attr('data-likes',likesCount);
                $(self).html(`${likesCount} Likes`);
            })

        })
    }
}