<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/commentsDao.php';  

class CommentsService extends BaseService
{   
    public function __construct()
    {
        parent::__construct(new Comment);
    }
    
    public function getAllComments(){
        $comments = $this->dao->getAllComments();
        if(empty($comments)){
            throw new RuntimeException("Comments not found.");
        }
        return $comments;
    }
    
    public function getCommentsByEvent($event_id){
        if(empty($event_id)){
            throw new InvalidArgumentException("Event ID cannot be empty.");
        }
        if(!is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("Event ID must be a positive number.");
        }
        
        $comments = $this->dao->getCommentsByEvent($event_id);
        if(empty($comments)){
            throw new RuntimeException("No comments found for this event.");
        }
        return $comments;
    }
    
    public function getCommentsByUser($user_id){
        if(empty($user_id)){
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0){
            throw new InvalidArgumentException("User ID must be a positive number.");
        }
        
        $comments = $this->dao->getCommentsByUser($user_id);
        if(empty($comments)){
            throw new RuntimeException("No comments found for this user.");
        }
        return $comments;
    }
    
    public function getCommentCount($event_id){
        if(empty($event_id)){
            throw new InvalidArgumentException("Event ID cannot be empty.");
        }
        if(!is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("Event ID must be a positive number.");
        }
        
        return $this->dao->getCommentCount($event_id);
    }
}
?>