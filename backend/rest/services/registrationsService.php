<?php
require_once __DIR__ . '/baseService.php';
require_once __DIR__ . '/../dao/registrationsDao.php';  

class RegistrationsService extends BaseService
{   
    public function __construct()
    {
        parent::__construct(new Registration);
    }
    
    public function getAllRegistrations(){
        $registrations = $this->dao->getAllRegistrations();
        if(empty($registrations)){
            throw new RuntimeException("Registrations not found.");
        }
        return $registrations;
    }
    
    public function getRegistrationsByEvent($event_id){
        if(empty($event_id)){
            throw new InvalidArgumentException("Event ID cannot be empty.");
        }
        if(!is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("Event ID must be a positive number.");
        }
        
        $registrations = $this->dao->getRegistrationsByEvent($event_id);
        if(empty($registrations)){
            throw new RuntimeException("No registrations found for this event.");
        }
        return $registrations;
    }
    
    public function getRegistrationsByUser($user_id){
        if(empty($user_id)){
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0){
            throw new InvalidArgumentException("User ID must be a positive number.");
        }
        
        $registrations = $this->dao->getRegistrationsByUser($user_id);
        if(empty($registrations)){
            throw new RuntimeException("No registrations found for this user.");
        }
        return $registrations;
    }
    
    public function isUserRegistered($user_id, $event_id){
        if(empty($user_id) || empty($event_id)){
            throw new InvalidArgumentException("User ID and Event ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0 || !is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("IDs must be positive numbers.");
        }
        
        return $this->dao->isUserRegistered($user_id, $event_id);
    }
    
    public function registerUser($user_id, $event_id){
        if(empty($user_id) || empty($event_id)){
            throw new InvalidArgumentException("User ID and Event ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0 || !is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("IDs must be positive numbers.");
        }
        
        return $this->dao->registerUser($user_id, $event_id);
    }
    
    public function unregisterUser($user_id, $event_id){
        if(empty($user_id) || empty($event_id)){
            throw new InvalidArgumentException("User ID and Event ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0 || !is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("IDs must be positive numbers.");
        }
        
        return $this->dao->unregisterUser($user_id, $event_id);
    }
    
    public function getRegistrationCount($event_id){
        if(empty($event_id)){
            throw new InvalidArgumentException("Event ID cannot be empty.");
        }
        if(!is_numeric($event_id) || $event_id <= 0){
            throw new InvalidArgumentException("Event ID must be a positive number.");
        }
        
        return $this->dao->getRegistrationCount($event_id);
    }
    
    public function getUpcomingEventsByUser($user_id){
        if(empty($user_id)){
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        if(!is_numeric($user_id) || $user_id <= 0){
            throw new InvalidArgumentException("User ID must be a positive number.");
        }
        
        $events = $this->dao->getUpcomingEventsByUser($user_id);
        if(empty($events)){
            throw new RuntimeException("No upcoming events found for this user.");
        }
        return $events;
    }
}
?>