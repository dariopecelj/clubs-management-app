<?php
require_once __DIR__ . "/baseDao.php";  

class Club extends BaseDao {
    
    public function __construct(){
        parent::__construct("clubs");
    }
    
    public function getAllClubs()
    {
        $query = "SELECT * FROM " . $this->table_name;
        return $this->query($query, []);
    }
    
    public function getClubById($id) {
        return $this->getById($id);
    }
    
    public function getClubsByCreator($creator_user_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE creator_user_id = :creator_user_id";
        $params = [':creator_user_id' => $creator_user_id];
        return $this->query($query, $params);
    }
    
    public function updateClub($data, $id) {
        return $this->update($data, $id);
    }
    
    public function deleteClub($id) {
        return $this->delete($id);
    }
    
    public function searchClubs($search_term) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE club_name LIKE :search OR description LIKE :search";
        $params = [':search' => '%' . $search_term . '%'];
        return $this->query($query, $params);
    }
}
?>