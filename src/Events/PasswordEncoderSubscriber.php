<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;


/**
 * Permet de d'encoder le mot de passe utilisateur avant son inscription dans la bdd
 * Cette classe est automatiquement appelée à chaque requête requete http (parce qu'elle implémente l'interface EventSubscriberInterface)
 */
class PasswordEncoderSubscriber implements EventSubscriberInterface
{

    /** @var UserPasswordEncoderInterface */
    private $encoder;

    // Constructeur qui prend en injection de dépendance l'encodeur de symfony
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    // Fonction qui est automatiquement appelée lors d'une requête http (ici avant la validation des données de la requête)
    public static function getSubscribedEvents()
    {
        // Retourne la fonction encodePassword comme évenement du Kernel en pré-écriture (avant l'écriture dans la bdd du mot de passe)
        return[
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    // Permet d'encoder le mot de passe utilisateur
    public function encodePassword(GetResponseForControllerResultEvent $event)
    {
        $user = $event->getControllerResult();
        //dd($user);

        $method = $event->getRequest()->getMethod(); // on récup la méthode utilisée (POST, GET, PUT...)

        // Si $user est bien un utilisateur (une instance de la classe User) et que la mèthode est bien POST alors...
        if($user instanceof User && $method === "POST"){
            $hash = $this->encoder->encodePassword($user, $user->getPassword()); // on crypte le mot de passe de l'utilisateur
            $user->setPassword($hash); // on met le mot de passe crypté à la place du mot de passe 'clair' de l'utilisateur
        }
    }
}