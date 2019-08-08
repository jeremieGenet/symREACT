<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;


/**
 * Permet lors de la création d'un nouveau client, de lui assigner l'utilisateur en cours (celui qui est connecté)
 * Cette classe est automatiquement appelée à chaque requête requete http (parce qu'elle implémente l'interface EventSubscriberInterface)
 */
class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    // A la contruction de la classe on récup en injection de dépendance de la classe "Security" de symfony (permet entre autre de récup l'utilisateur actuellement connecté)
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    // Fonction qui est automatiquement appellé lors d'une requête http (ici avant la validation des données de la requête)
    public static function getSubscribedEvents()
    {
        return[
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(GetResponseForControllerResultEvent $event){
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // On récup la méthode de requête (POST, GET...)
        

        if($customer instanceof Customer && $method === "POST"){

            // On récup l'utilisateur actuellement connecté (grace à l'injection de dépendance du contructeur et la classe Security)
            $user = $this->security->getUser();
            // On assigne l'utilisateur au Customer qu'on est en train de créer
            $customer->setUser($user);
        }

    }
}