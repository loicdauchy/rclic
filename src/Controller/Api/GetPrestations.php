<?php

namespace App\Controller\Api;

use App\Repository\UsersRepository;
use App\Repository\PrestationsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class GetPrestations extends AbstractController
{
    /**
     * @var UsersRepository
     */
    protected $userRepo;

    /**
     * @var PrestationsRepository
     */
    protected $pretationsRepository;

    /**
     * GetPrestations constructor.
     * @param UsersRepository $userRepo
     * @param PrestationsRepository $pretationsRepository
     */
    public function __construct(
                                UsersRepository $userRepo,
                                PrestationsRepository $pretationsRepository
                               )
    {
        $this->userRepository = $userRepo;
        $this->pretationsRepository = $pretationsRepository;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($id)
    {
        $user = $this->userRepository->find($id);

        $prestations = $this->pretationsRepository->findPrestaByUser($user);

        return [
            'prestations' => $prestations,
            'message' => 'success',
        ];
    }
}