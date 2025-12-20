<?php
require_once __DIR__ . "/BaseDao.php";  

class Registration extends BaseDao {
    
    public function __construct(){
        parent::__construct("registrations");
    }
    
    public function getAllRegistrations()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY registered_at DESC";
        return $this->query($query, []);
    }
    
    public function getRegistrationsByEvent($event_id) {
        $query = "SELECT r.*, u.full_name, u.email 
                  FROM " . $this->table_name . " r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.event_id = :event_id 
                  ORDER BY r.registered_at DESC";
        $params = [':event_id' => $event_id];
        return $this->query($query, $params);
    }
    
    public function getRegistrationsByUser($user_id) {
        $query = "SELECT r.*, e.title, e.event_date, e.location, e.image 
                  FROM " . $this->table_name . " r
                  JOIN events e ON r.event_id = e.id
                  WHERE r.user_id = :user_id 
                  ORDER BY e.event_date DESC";
        $params = [':user_id' => $user_id];
        return $this->query($query, $params);
    }
    
    public function isUserRegistered($user_id, $event_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND event_id = :event_id";
        $params = [':user_id' => $user_id, ':event_id' => $event_id];
        $result = $this->query($query, $params);
        return !empty($result);
    }
    
    public function registerUser($user_id, $event_id) {
        if ($this->isUserRegistered($user_id, $event_id)) {
            throw new Exception("User is already registered for this event.");
        }
        $data = [
            'user_id' => $user_id,
            'event_id' => $event_id
        ];
        return $this->add($data);
    }
    
    public function unregisterUser($user_id, $event_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND event_id = :event_id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":user_id", $user_id);
        $stmt->bindValue(":event_id", $event_id);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Failed to unregister user.");
        }
    }
    
    public function deleteRegistration($id) {
        return $this->delete($id);
    }
    
    public function getRegistrationCount($event_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE event_id = :event_id";
        $params = [':event_id' => $event_id];
        $result = $this->query_unique($query, $params);
        return $result['count'];
    }
    
    public function getUpcomingEventsByUser($user_id) {
        $query = "SELECT r.*, e.title, e.event_date, e.location, e.image 
                  FROM " . $this->table_name . " r
                  JOIN events e ON r.event_id = e.id
                  WHERE r.user_id = :user_id AND e.event_date >= CURDATE()
                  ORDER BY e.event_date ASC";
        $params = [':user_id' => $user_id];
        return $this->query($query, $params);
    }
}
?>