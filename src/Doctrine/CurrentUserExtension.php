<?php

namespace App\Doctrine;

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

/**
 * Permet de générer des requêtes DQL à Doctrine
 */
class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    /**
     * Permet de paramètrer ou la requête DQL (doctrine) sera faite, ici on param pour récup les invoices et les customers en fonction de l'utilisateur qui est connecté
     *
     * @param QueryBuilder $queryBuilder
     * @param string $resourceClass
     * @return void
     */
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        // Obtenir l'utilisateur connécté
        $user = $this->security->getUser();

        // Si on demande des invoices ou des customers et que l'utilisateur n'est pas admin et que l'utilisateur connecté est bien une instance de User alors... 
        // on agi sur la requête pour qu'elle tienne compte de l'utilisateur connécté 
        if(
            ($resourceClass === Customer::class || $resourceClass === Invoice::class) 
            && !$this->auth->isGranted('ROLE_ADMIN') 
            && $user instanceof User)
            {

            // On récup l'Alias de la table Invoice (getRootAliases() permet de récup un tableau des alias des tables, et ici on récup le 1er alias du tableau)
            $rootAlias = $queryBuilder->getRootAliases()[0];
            //dd($rootAlias); // Retourne "o" (qui est l'alias de la table représentée par $resourceClass, soit Customer ou Invoice)

            if($resourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }else if($resourceClass === Invoice::class){
                $queryBuilder->join("$rootAlias.customer", "c")
                             ->andWhere("c.user = :user");
            } 

            $queryBuilder->setParameter("user", $user);

            //dd($queryBuilder);
        }
    }

    /**
     * Permet de récupérer une collection de réponse DQL (doctrine), addWhere permet de récup les invoices et les customers en fonction de l'utilisateur
     *
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     * @return void
     */
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    /**
     * Permet de récupérer une unique réponse DQL (doctrine), addWhere permet de récup une invoice et un customer en fonction de l'utilisateur
     *
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param array $identifiers
     * @param string|null $operationName
     * @param array $context
     * @return void
     */
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}