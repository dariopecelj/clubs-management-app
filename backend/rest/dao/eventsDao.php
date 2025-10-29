<?php
require_once __DIR__ . "/baseDao.php";  

class Event extends BaseDao {
    
    protected $table_name;
    
    public function __construct(){
        $this->table_name = "events";
        parent::__construct("$this->table_name");
    }
    
    public function getAllEvents()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY event_date DESC";
        return $this->query($query, []);
    }
    
    public function getEventById($event_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE event_id = :event_id";
        $params = [':event_id' => $event_id];
        return $this->query_unique($query, $params);
    }
    
    public function getEventsByClub($club_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE club_id = :club_id ORDER BY event_date DESC";
        $params = [':club_id' => $club_id];
        return $this->query($query, $params);
    }
    
    public function getUpcomingEvents() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE event_date >= CURDATE() ORDER BY event_date ASC";
        return $this->query($query, []);
    }
    
    public function getPastEvents() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE event_date < CURDATE() ORDER BY event_date DESC";
        return $this->query($query, []);
    }
    
    public function getEventWithClubInfo($event_id) {
        $query = "SELECT e.*, c.club_name, c.logo as club_logo 
                  FROM " . $this->table_name . " e
                  JOIN clubs c ON e.club_id = c.club_id
                  WHERE e.event_id = :event_id";
        $params = [':event_id' => $event_id];
        return $this->query_unique($query, $params);
    }
    
    public function updateEvent($data, $event_id) {
        return $this->update($data, $event_id, 'event_id');
    }
    
    public function deleteEvent($event_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE event_id = :event_id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":event_id", $event_id);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Failed to delete event.");
        }
    }
    
    public function searchEvents($search_term) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE title LIKE :search OR description LIKE :search OR location LIKE :search
                  ORDER BY event_date DESC";
        $params = [':search' => '%' . $search_term . '%'];
        return $this->query($query, $params);
    }
}
?>