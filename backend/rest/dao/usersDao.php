<?php
require_once __DIR__ . "/baseDao.php";  

class User extends BaseDao {
    
    public function __construct(){
        parent::__construct("users");
    }
    
    public function getAllUsers()
    {
        $query = "SELECT * FROM " . $this->table_name;
        return $this->query($query, []);
    }
    
    public function getUserByEmail($email) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email";
        $params = [':email' => $email];  
        return $this->query_unique($query, $params);  
    }
    
    public function updateUser($data, $id) {
        return $this->update($data, $id);
    }
    
    public function deleteUser($id) {
        return $this->delete($id);
    }
    
    public function getUserById($id){
        return $this->getById($id);
    }
    
    public function getUsersByRole($role) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE role = :role";
        $params = [':role' => $role];  
        return $this->query($query, $params);  
    }
}
?>