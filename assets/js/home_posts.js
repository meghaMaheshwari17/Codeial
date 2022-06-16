// // whenever a post is getting submitted, it should not get submitted directly but throught jquery ajax

{   //function which sends the post data to the controller action \
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();  // whenever the form gets submitted, I don't want it to submit directly 
           //ajax request
            $.ajax({
                type: 'post',
                url: '/posts/create', //where data will be sent
                data: newPostForm.serialize(), //converting it to json
                success: function(data){
                    let newPost = newPostDom(data.data.post);  //getting it in html form
                    $('#posts-list-container>ul').prepend(newPost); //appending it to dom
                    deletePost($(' .delete-post-button', newPost));  //sending the a tag to delete function,//for deleting it:- newPost contains this class called delete-post-button,that's how it gets accesssed

                    // call the create comment class
                    new PostComments(data.data.post._id); //sending the post id to home_comments.js to create and delete comments throgh ajax
                    // calling the toggle like class ont the new post
                    new ToggleLike($('.toggle-like-button', newPost));
                    notySuccess(data.message); //if successful then show flash message

                }, error: function(error){ //if error then show error
                    notyError(error.responseText);
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">    
                        <small>
                            <a class="delete-post-button"  href="/posts/destroy/${ post._id }">X</a>
                        </small>
                        ${ post.content }
                        <br>
                        <p>
                        ${ post.user.name }
                        </p>
                        <!-- display the likes of the post:- showing 0 likes by default-->
                         <br>
                         <small>
                              <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post"> 
                                0 Likes  
                              </a>
                          </small>
                        <!-- displaying comments of the post -->
                    <div class="post-comments">
                        <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type Here to add comment..." required>
                            <!-- have to send post id -->
                            <input type="hidden" name="post" value="${ post._id }" >
                            <input type="submit" value="Add Comment">
                        </form>
                        <div class="post-comments-list">
                            <ul id="post-comments-${ post._id }">
                                
                            </ul>
                        </div>
                    </div>
                    
                </li>`)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),  //getting the url from a tag
                success: function(data){ //getting this data from post controller
                    $(`#post-${data.data.post_id}`).remove();
                    notySuccess(data.message);
                },error: function(error){
                    notyError(error.responseText);
                    console.log(error.responseText);
                }
            });

        });
    }





    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId); //sending the post id to home_comments.js
        });
    }


    // for flash messages 
       //if successfull
    function notySuccess(text){
      console.log('noty');
       new Noty({
         theme:'relax', 
          text: text, 
          type:'success',
         layout:'topRight',
         timeout:1000
      }).show();
    }
    //if error
    function notyError(text){
      new Noty({
        theme:'relax', 
         text: text, 
         type:'error',
         layout:'topRight',
         timeout:1000
      }).show();
    }

    createPost();
    convertPostsToAjax();
}