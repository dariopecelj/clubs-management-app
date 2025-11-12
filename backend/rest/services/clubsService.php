<?php
require_once __DIR__ . '/baseService.php';
require_once __DIR__ . '/../dao/clubsDao.php';  

class ClubsService extends BaseService
{   
    public function __construct()
    {
        parent::__construct(new Club);
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
}
?>