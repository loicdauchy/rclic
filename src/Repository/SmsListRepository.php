<?php

namespace App\Repository;

use App\Entity\SmsList;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SmsList|null find($id, $lockMode = null, $lockVersion = null)
 * @method SmsList|null findOneBy(array $criteria, array $orderBy = null)
 * @method SmsList[]    findAll()
 * @method SmsList[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SmsListRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SmsList::class);
    }

   /**
    * @return SmsList[] Returns an array of SmsList objects
    */    
    public function findByRdv($rdv)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.rdv = :rdv')
            ->setParameter('rdv', $rdv)
            ->setMaxResults(1)
            ->getQuery()
            ->getResult()
        ;
    }
    

    /*
    public function findOneBySomeField($value): ?SmsList
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
