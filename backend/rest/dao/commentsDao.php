<?php
require_once __DIR__ . "/baseDao.php";  

class Comment extends BaseDao {
    
    protected $table_name;
    
    public function __construct(){
        $this->table_name = "comments";
        parent::__construct("$this->table_name");
    }
    
    public function getAllComments()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        return $this->query($query, []);
    }
    
    public function getCommentsByEvent($event_id) {
        $query = "SELECT c.*, u.full_name, u.email 
                  FROM " . $this->table_name . " c
                  JOIN users u ON c.user_id = u.user_id
                  WHERE c.event_id = :event_id 
                  ORDER BY c.created_at DESC";
        $params = [':event_id' => $event_id];
        return $this->query($query, $params);
    }
    
    public function getCommentsByUser($user_id) {
        $query = "SELECT c.*, e.title as event_title 
                  FROM " . $this->table_name . " c
                  JOIN events e ON c.event_id = e.event_id
                  WHERE c.user_id = :user_id 
                  ORDER BY c.created_at DESC";
        $params = [':user_id' => $user_id];
        return $this->query($query, $params);
    }
    
    public function updateComment($data, $comment_id) {
        return $this->update($data, $comment_id, 'comment_id');
    }
    
    public function deleteComment($comment_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE comment_id = :comment_id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":comment_id", $comment_id);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Failed to delete comment.");
        }
    }
    
    public function getCommentCount($event_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE event_id = :event_id";
        $params = [':event_id' => $event_id];
        $result = $this->query_unique($query, $params);
        return $result['count'];
    }
}
?>