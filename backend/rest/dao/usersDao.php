<?php
require_once __DIR__ . "/baseDao.php";  

class User extends BaseDao {
    
    protected $table_name;
    
    public function __construct(){
        $this->table_name = "users";
        parent::__construct("$this->table_name");
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
        return $this->update($data, $id, 'user_id');
    }
    
    public function deleteUser($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":id", $id);
        if ($stmt->execute()) {
            return true;  
        } else {
            throw new Exception("Failed to delete user.");
        }
    }
    
    public function getUserById($id){
        $query = "SELECT * FROM ". $this->table_name . " WHERE user_id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getUsersByRole($role) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE role = :role";
        $params = [':role' => $role];  
        return $this->query($query, $params);  
    }
}
?>