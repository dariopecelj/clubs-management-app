<?php
require_once __DIR__ . "/BaseDao.php";  

class Comment extends BaseDao {
    
    public function __construct(){
        parent::__construct("comments");
    }
    
    public function getAllComments()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        return $this->query($query, []);
    }
    
    public function getCommentsByEvent($event_id) {
        $query = "SELECT c.*, u.full_name, u.email 
                  FROM " . $this->table_name . " c
                  JOIN users u ON c.user_id = u.id
                  WHERE c.event_id = :event_id 
                  ORDER BY c.created_at DESC";
        $params = [':event_id' => $event_id];
        return $this->query($query, $params);
    }
    
    public function getCommentsByUser($user_id) {
        $query = "SELECT c.*, e.title as event_title 
                  FROM " . $this->table_name . " c
                  JOIN events e ON c.event_id = e.id
                  WHERE c.user_id = :user_id 
                  ORDER BY c.created_at DESC";
        $params = [':user_id' => $user_id];
        return $this->query($query, $params);
    }
    
    public function updateComment($data, $id) {
        return $this->update($data, $id);
    }
    
    public function deleteComment($id) {
        return $this->delete($id);
    }
    
    public function getCommentCount($event_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE event_id = :event_id";
        $params = [':event_id' => $event_id];
        $result = $this->query_unique($query, $params);
        return $result['count'];
    }
}
?>