<?php
require_once __DIR__ . "/baseDao.php";  

class Event extends BaseDao {
    
    public function __construct(){
        parent::__construct("events");
    }
    
    public function getAllEvents()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY event_date DESC";
        return $this->query($query, []);
    }
    
    public function getEventById($id) {
        return $this->getById($id);
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
    
    public function getEventWithClubInfo($id) {
        $query = "SELECT e.*, c.club_name, c.logo as club_logo 
                  FROM " . $this->table_name . " e
                  JOIN clubs c ON e.club_id = c.id
                  WHERE e.id = :id";
        $params = [':id' => $id];
        return $this->query_unique($query, $params);
    }
    
    public function updateEvent($data, $id) {
        return $this->update($data, $id);
    }
    
    public function deleteEvent($id) {
        return $this->delete($id);
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