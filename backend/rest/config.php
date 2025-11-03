<?php
class Config {
    
    public static function DB_NAME() {
        return "univibe-db";
    }
    
    public static function DB_PORT() {
        return 3306;
    }
    
    public static function DB_USER() {
        return 'root';
    }
    
    public static function DB_PASSWORD() {
        return '';
    }
    
    public static function DB_HOST() {
        return 'localhost';
    }
    
    public static function JWT_SECRET() {
        return 'dario2000';
    }
}
?>