// whenever a post is getting submitted, it should not get submitted directly but throught jquery ajax

{
    //function which sends the post data to the controller action 
    //method to submit the form data for new post using AJAX 
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            // whenever the form gets submitted, I don't want it to submit directly 
            e.preventDefault();
            //submit it with ajax 
            $.ajax({
                type:'post',
                url:'/posts/create',//where form is sending data 
                data:newPostForm.serialize(),//converts the form data into json
                success:function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);//for displaying it in dom
                    deletePost($(' .delete-post-button',newPost)); //for deleting it:- newPost contains this class called delete-post-button,that's how it gets accesssed
                },
                error:function(error){
                    console.log(error.responseText);
                }
            });
        });

    }
   
    //creating the post and showing it in DOM
    let newPostDom=function(post){
        return $(`
        <li id="post-${post._id}">
        <!-- checking if user logged in is same as the user who posted it -->
        <!-- locals.user is to check if user is there -->
         
          <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
          </small>

          ${post.content}
         <br>
         <p>
         ${post.user.name}
         </p>
         <!-- displaying comments of the post -->
         <div class="post-comments">
          
            <form method="POST" action="/comments/create"> <!-- creating comments    -->
              <input type="text" name="content" cols="20" rows="1" placeholder="Comment here..." required></textarea>
              <!-- need to send the postid -->
              <input type="hidden" name="post" value="${post._id}" />
              <input type="submit" value="Add Comment">
            </form>
        
          <!--displaying created comments -->
          <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
              
            </ul>
          </div>
    </li>`)
    }

    //method to delete post 
    let deletePost = function(deleteLink) {
      $(deleteLink).click(function(e) {
           e.preventDefault();
           $.ajax({
             type:'get',
             url:$(deleteLink).prop('href'),
             success:function(data) { //getting this data from posts_controller
                   $(`#post-${data.data.post_id}`).remove();
             },error:function(error){
               console.log(error);
             }
           })
      })
    }


    createPost();
    

}