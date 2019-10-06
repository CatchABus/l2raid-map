<?php
try
{
    $con = new PDO("mysql:host=localhost;dbname=l2jdb", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $statement = $con->prepare("SELECT name, loc_x, loc_y, loc_z, respawn_time FROM raidboss_spawnlist INNER JOIN npc ON raidboss_spawnlist.boss_id = npc.id");
    $statement->execute();

    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    if ($result)
    {
        echo json_encode($result);
    }
    else
    {
        http_response_code(400);
    }
}
catch(PDOException $e)
{
    echo "Error: ".$e->getMessage();
}