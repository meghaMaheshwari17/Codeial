// //to create and delete comments dynamically 

//     let createComments=function(){
//         let newCommentForm=$('#post-comment-form');
//         newCommentForm.submit(function(e){
//             e.preventDefault(); //to prevent the form from being submitted
//             //ajax request 
//             $.ajax({
//                 type: 'post',
//                 url:'/comments/create', //where form is sending the data
//                 data:newCommentForm.serialize(), //converting the data to json
//                 success: function(data){
//                     // console.log(data.data.commentData);
//                     console.log('a');
//                     let newComment=newCommentsDom(data.data.commentData);
//                    $('.post-comments-list>ul').prepend(newComment);
//                    notySuccess(data.message);
//                    deleteComment($(' .delete-comment-button',newComment));
//                 },error: function(error){
//                    console.log(error);
//                 }
//             })
            
//         })
//     }

//     //for showing the comments in the dom 
//     let newCommentsDom=function(comment){
//          return $(`
//          <li id="${comment._id}">
//            <p>
//              <small>
//                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
//              </small>
//            ${comment.content}
//            <br>
//            <small>${comment.user.name}</small>
//            </p>
//          </li> 
//          `)
//     }
//     //for deleting comments 
//     let deleteComment =function(deleteLink){
//         $(deleteLink).click(function(e){
//             e.preventDefault();
//             $.ajax({
//                 type:'get',
//                 url:$(deleteLink).prop('href'),
//                 success:function(data){
//                   notyError('deleted');
//                     console.log('success');
//                 },
//                 error:function(data){

//                 }
//             })
//         })
//     }

//     // for flash messages 
//       //if successfull
//       function notySuccess(text){
//         //   console.log('noty comments');
//         // console.log('noty');
//         new Noty({
//           theme:'relax', 
//            text: text, 
//            type:'success',
//            layout:'topRight',
//            timeout:1000
//         }).show();
//       }
//       //if error
//       function notyError(text){
//         new Noty({
//           theme:'relax', 
//            text: text, 
//            type:'error',
//            layout:'topRight',
//            timeout:1000
//         }).show();
//       }
//     createComments();

// }


//need to create class because we need post id of the post of whose comment we are gonna delete, so we can know of which post to delete comment
class PostComments { //calling this class in home_posts.js to get the post id 
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
      this.postId = postId;
      this.postContainer = $(`#post-${postId}`); //individual post container
      this.newCommentForm = $(`#post-${postId}-comments-form`); //comment form of the particular 

      this.createComment(postId);

      let self = this;
      // call for all the existing comments
    
      $(' .delete-comment-button', this.postContainer).each(function () {
          self.deleteComment($(this));
      });
      
  }


  createComment(postId) {
      let pSelf = this;
      this.newCommentForm.submit(function (e) {
          e.preventDefault();
          let self = this;

          $.ajax({
              type: 'post',
              url: '/comments/create',
              data: $(self).serialize(),
              success: function (data) {
                  console.log(data.data.commentData);
                  let newComment = pSelf.newCommentDom(data.data.commentData);
                  $(`#post-comments-${postId}`).prepend(newComment);
                   pSelf.deleteComment($(' .delete-comment-button', newComment));
                //  to get the toggle like class for comments 
                new ToggleLike($('.toggle-like-button', newComment));
                   notySuccess(data.message);

              }, error: function (error) {
                  console.log(error.responseText);
              }
          });


      });
  }


  newCommentDom = function (comment) {
      // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
      return $(`
         <li id="comment-${comment._id}">
           <p>
             <small>
               <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
             </small>
           ${comment.content}
           <br>
           <small>${comment.user.name}</small>
           </p>
           <!-- displaying likes for comment --> 
           <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment"> 
             0 Likes
            </a>
      </small>
         </li> 
         `)
  }


  deleteComment(deleteLink) {
      $(deleteLink).click(function (e) {
          e.preventDefault();

          $.ajax({
              type: 'get',
              url: $(deleteLink).prop('href'),
              success: function (data) {
                  $(`#comment-${data.data.comment_id}`).remove();
                  notySuccess(data.message)
              }, error: function (error) {
                  notyError("You cannot delete this comment");
                  console.log(error.responseText);
              }
          });

      });
  }

}



    // for flash messages 
      //if successfull
      function notySuccess(text){
        //   console.log('noty comments');
        // console.log('noty');
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