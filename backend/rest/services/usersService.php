<?php
require_once __DIR__ . '/baseService.php';
require_once __DIR__ . '/../dao/usersDao.php';  

class UsersService extends BaseService
{   
    public function __construct()
    {
        parent::__construct(new User);
    }
    
    public function getAllUsers(){
        $users = $this->dao->getAllUsers();
        if(empty($users)){
            throw new RuntimeException("Users not found.");
        }
        return $users;
    }
    
    public function getUserByEmail($email){
        if(empty($email)){
            throw new InvalidArgumentException("Email cannot be empty.");
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            throw new InvalidArgumentException("Invalid email format.");
        }
        
        $user = $this->dao->getUserByEmail($email);
        if(empty($user)){
            throw new RuntimeException("User not found.");
        }
        return $user;
    }
    
    public function getUsersByRole($role){
        if(empty($role)){
            throw new InvalidArgumentException("Role cannot be empty.");
        }
        
        $users = $this->dao->getUsersByRole($role);
        if(empty($users)){
            throw new RuntimeException("No users found with this role.");
        }
        return $users;
    }

    public function updateProfile($id, $data) {
        if (!is_numeric($id) || $id <= 0) {
            throw new Exception("ID must be a positive number");
        }

        if (!is_array($data) || empty($data)) {
            throw new Exception("Update data must be a non-empty array");
        }

        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (!empty($data['full_name'])) {
            $data['full_name'] = $data['full_name'];
        }

        return $this->dao->update($data, $id);
    }

    public function add($data) {
    if (!is_array($data) || empty($data)) {
        throw new Exception("User data must be a non-empty array");
    }

    if (empty($data['email']) || empty($data['password']) || empty($data['full_name'])) {
        throw new Exception("Email, password, and full name are required");
    }

    if (!empty($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    return parent::add($data);
}

}
?>