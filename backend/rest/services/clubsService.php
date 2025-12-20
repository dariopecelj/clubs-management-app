<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/clubsDao.php';  
require_once __DIR__ . '/usersService.php';  

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class ClubsService extends BaseService
{   
    private $usersService; 
    public function __construct()
    {   
        parent::__construct(new Club);
        $this->usersService = new UsersService();

    }
    
    public function getAllClubs(){
        $clubs = $this->dao->getAllClubs();
        if(empty($clubs)){
            throw new RuntimeException("Clubs not found.");
        }
        return $clubs;
    }
    
    public function getClubsByCreator($creator_user_id){
        if(empty($creator_user_id)){
            throw new InvalidArgumentException("Creator user ID cannot be empty.");
        }
        if(!is_numeric($creator_user_id) || $creator_user_id <= 0){
            throw new InvalidArgumentException("Creator user ID must be a positive number.");
        }
        
        $clubs = $this->dao->getClubsByCreator($creator_user_id);
        if(empty($clubs)){
            throw new RuntimeException("No clubs found for this creator.");
        }
        return $clubs;
    }
    
    public function searchClubs($search_term){
        if(empty($search_term)){
            throw new InvalidArgumentException("Search term cannot be empty.");
        }
        
        $clubs = $this->dao->searchClubs($search_term);
        if(empty($clubs)){
            throw new RuntimeException("No clubs found matching search term.");
        }
        return $clubs;
    }

 public function addClubAndUpgradeUser($data, $currentUser){
        // Validate data
        if(empty($data['club_name'])){
            throw new InvalidArgumentException("Club name is required.");
        }
        if(empty($data['creator_user_id'])){
            throw new InvalidArgumentException("Creator user ID is required.");
        }
        
        // Create the club using inherited add() method from BaseService
        $club = $this->add($data);
        
        $response = [
            'success' => true,
            'data' => $club,
            'message' => 'Club created successfully!'
        ];
        
        if($currentUser->role === Roles::USER){
            $this->usersService->update($currentUser->id, ['role' => Roles::CLUB_OWNER]);
            
            $currentUser->role = Roles::CLUB_OWNER;
            
            $payload = [
                'user' => $currentUser,
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24) // 24 hours
            ];
            
            $newToken = JWT::encode($payload, Config::JWT_SECRET(), 'HS256');
            
            $response['token'] = $newToken;
            $response['message'] = 'Club created successfully! You are now a Club Owner.';
        }
        
        return $response;
    }
}
?>