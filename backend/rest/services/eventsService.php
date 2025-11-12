<?php
require_once __DIR__ . '/baseService.php';
require_once __DIR__ . '/../dao/eventsDao.php';  

class EventsService extends BaseService
{   
    public function __construct()
    {
        parent::__construct(new Event);
    }
    
    public function getAllEvents(){
        $events = $this->dao->getAllEvents();
        if(empty($events)){
            throw new RuntimeException("Events not found.");
        }
        return $events;
    }
    
    public function getEventsByClub($club_id){
        if(empty($club_id)){
            throw new InvalidArgumentException("Club ID cannot be empty.");
        }
        if(!is_numeric($club_id) || $club_id <= 0){
            throw new InvalidArgumentException("Club ID must be a positive number.");
        }
        
        $events = $this->dao->getEventsByClub($club_id);
        if(empty($events)){
            throw new RuntimeException("Events not found for this club.");
        }
        return $events;
    }
    
    public function getUpcomingEvents(){
        $events = $this->dao->getUpcomingEvents();
        if(empty($events)){
            throw new RuntimeException("No upcoming events found.");
        }
        return $events;
    }
    
    public function getPastEvents(){
        $events = $this->dao->getPastEvents();
        if(empty($events)){
            throw new RuntimeException("No past events found.");
        }
        return $events;
    }
    
    public function getEventWithClubInfo($id){
        if(empty($id)){
            throw new InvalidArgumentException("Event ID cannot be empty.");
        }
        if(!is_numeric($id) || $id <= 0){
            throw new InvalidArgumentException("Event ID must be a positive number.");
        }
        
        $event = $this->dao->getEventWithClubInfo($id);
        if(empty($event)){
            throw new RuntimeException("Event not found.");
        }
        return $event;
    }
    
    public function searchEvents($search_term){
        if(empty($search_term)){
            throw new InvalidArgumentException("Search term cannot be empty.");
        }
        
        $events = $this->dao->searchEvents($search_term);
        if(empty($events)){
            throw new RuntimeException("No events found matching search term.");
        }
        return $events;
    }
}
?>