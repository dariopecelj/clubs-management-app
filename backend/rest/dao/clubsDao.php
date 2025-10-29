<?php
require_once __DIR__ . "/baseDao.php";  

class Club extends BaseDao {
    
    protected $table_name;
    
    public function __construct(){
        $this->table_name = "clubs";
        parent::__construct("$this->table_name");
    }
    
    public function getAllClubs()
    {
        $query = "SELECT * FROM " . $this->table_name;
        return $this->query($query, []);
    }
    
    public function getClubById($club_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE club_id = :club_id";
        $params = [':club_id' => $club_id];
        return $this->query_unique($query, $params);
    }
    
    public function getClubsByCreator($creator_user_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE creator_user_id = :creator_user_id";
        $params = [':creator_user_id' => $creator_user_id];
        return $this->query($query, $params);
    }
    
    public function updateClub($data, $club_id) {
        return $this->update($data, $club_id, 'club_id');
    }
    
    public function deleteClub($club_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE club_id = :club_id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":club_id", $club_id);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Failed to delete club.");
        }
    }
    
    public function searchClubs($search_term) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE club_name LIKE :search OR description LIKE :search";
        $params = [':search' => '%' . $search_term . '%'];
        return $this->query($query, $params);
    }
}
?>